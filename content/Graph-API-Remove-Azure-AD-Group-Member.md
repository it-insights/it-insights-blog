---
title: Graph API - Remove Azure AD Group Member
tags:
  - Azure
  - Azure AD
  - Office 365
  - Microsoft 365
  - PowerShell
category:
  - AzureAD
  - Microsoft Graph API
author: Jacob Meissner
comments: false
date: 2022-04-02 11:01:22
---


Many tasks and processes can be automated quickly and easily using the Microsoft Graph API. This can be implemented with low-code applications such as Logic App or, for example, via Azure Function and PowerShell. Depending on the requirements, complexity, a variety of options are available.
<!-- more -->

 But also in the Azure Cloud in Logic Apps and Azure Functions you should look at the cost situation in advance, so that this should also be part of the decision.

 Therefore, here is an example of how the Graph API can be used in Azure Functions to get all group members of a group and then remove deactivated users from the group.


 1. In the first step we get the corresponding group members from the Graph API (/groups). The Graph API returns only 100 entries by default, so simple API request is not enough and we have to work with NextLink.


 ```powershell 
$responseMember = Invoke-RestMethod -Method Get -Uri https://graph.microsoft.com/v1.0/groups/{GroupId}/members/ -Headers $graphHeader -Body $body

$aadGroupMember = $ResponseMember.value

$aadGroupMemberNextLink = $ResponseMember."@odata.nextLink"
```


2. In the next step we create a while loop and let it run until all data is contained in our specified variable. 

```powershell 

while ($aadGroupMemberNextLink -ne $null) {

    $responseMember = (Invoke-RestMethod -Method Get -Uri $aadGroupMemberNextLink -Headers $graphHeader -body $body)

    $aadGroupMemberNextLink = $ResponseGroupmember."@odata.nextLink"

    $aadGroupMember += $ResponseMember.value

}
```


3. If we now set a count on our variable, the value should contain the number of current members of the group. This can be verified e.g. by calling the group in the Azure Portal (Overview). 

```powershell
($aadGroupMember).count
```


4. In the next step we use a foreach loop and within the loop we check the status of each user and if it is disabled this user will be removed from the group. 

```powershell
foreach ($aadmember in $aadGroupMember) {
    $MemberId = $aadmember.id
    $member = Invoke-RestMethod -Method Get -Uri "https://graph.microsoft.com/beta/users/$MemberId" -Headers $graphHeader

       if ($member.accountEnabled) {
      }
        else {
	        $DisabledUser = $member.id
		    Invoke-RestMethod -Method Delete -Uri "https://graph.microsoft.com/v1.0/groups/{GroupId}/members/$DisabledUser/`$ref" -Headers $graphHeader
      }
}
```
