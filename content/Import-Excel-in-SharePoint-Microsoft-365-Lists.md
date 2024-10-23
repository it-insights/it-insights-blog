---
title: Import Excel in SharePoint & Microsoft 365 Lists
tags:
  - SharePoint Online
  - Power Automate
  - Excel
  - Microsoft Lists
category:
  - SharePoint Online
author: Jacob Meissner
comments: false
date: 2022-06-12 01:29:43
---

In many cases, the use of Microsoft 365 Services requires existing processes & workflows to be reworked and existing Microsoft Excel lists to be replaced by Power Apps and SharePoint Online Lists / Microsoft Lists, because with the integration into the native Office 365 environment, new and significant possibilities for automation are provided and previously time-consuming processes can be accelerated.
<!-- more -->

During step-by-step implementation, SharePoint lists or M365 lists are generally created and the automation options integrated until the application meets the specified requirements and can be put into production. At this point, the existing data from Excel must mostly be transferred to the SharePoint Online or Microsoft Lists.

Some ways to migrate the data from the Excel to the SharePoint Online list are described in the following sections.

### Copy & Paste 
A simple option is to copy and paste the data into the SharePoint Online list. 

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220813012444.png" alt="SharePoint Online List Copy & Paste"}
::

To do this, the list must be opened in SharePoint and opened in Quick Edit Mode / Grid View. Then simply copy the data (without header) from the Excel file and copy it into the first row in the SharePoint Online list. 

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220813012831.png" alt="SharePoint Online List Copy & Paste"}
::

### Excel Upload & Create new SharePoint Online List

Another possibility is to create a new list via the SharePoint Online / Microsoft Lists Portal and select "From Excel" in the menu during creation or upload the file alternatively within Excel upload to SharePoint. However, the disadvantage here is that a new list is created and possibly a prepared and customized SharePoint Online list cannot be used.

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220813012006.png" alt="SharePoint Online List Copy & Paste"}
::

### Import Data with Power Automate Flow

Furthermore, Power Automate (Microsoft Flow) can be used to transfer Excel lists / tables into SharePoint Online lists. For this purpose, you can use the connectors Excel Online Business and SharePoint available in Power Automate.

In other words, you check and update the existing Excel spreadsheet and save it to OneDrive for Business or SharePoint Online, so that the Power Automate workflow can access it.

In the next step, you create a new Power Automate Flow and use, for example, a manual "Instant Cloud Flow" and add the connector Excel Online Business. As action you use the function "List rows present in a table" and select the Excel file to be used including the table.

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220827000146.png" alt="SharePoint Online List Copy & Paste"}
::

To import a table into a SharePoint Online Power Automate, the table in the Excel file must also be formatted as a table. First make sure that the table is correctly formatted as shown in the following screenshot. 

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220827000857.png" alt="SharePoint Online List Copy & Paste"}
::

In the next task, go through the columns step by step and analyze the correct formatting and assignment, because for some formatting it is not so easy to apply fields like "True / False". 

For example, if we have in the SharePoint Online List we have a field of type "Yes/No" and we want to take the values from the Excel file (Filed1) and use the column mapping for this we will run an error on execution, so we have to work with a condition for this.  

For this you create a condition within the flow and configure it with your True /False (Field1) from Excel and set the condition ("Field1" is equal to "True"). In the next step you create the Create Item SharePoint action and configure the fields If Yes "Field1=Yes" and If no "Field1=No". 

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220827001013.png" alt="SharePoint Online List Copy & Paste"}
::

With this possibility you can transfer the existing True / False fields directly into SharePoint Online fields and can use the functions in the cloud.

Another challenge is that fields of the type "Number" are not selectable and cannot be assigned directly. 
To import them anyway you can use an expression and define the field by yourself (Field4).

```
items('Apply_to_each')?['Field4']
```

After adding and executing the flow, values from the Type Number are now also correctly imported into the SharePoint list.

::blogImage{src="posts/import-excel-in-sharepoint-microsoft-365-lists/20220827001231.png" alt="SharePoint Online List Copy & Paste"}
::

This short post is to give an overview about the import of SharePoint lists and data from Excel. There are of course other possibilities some third party tools that can be used to import Excel data. Taking a look at the existing tools like Power Automate can't hurt, as this already meets the requirements in many cases.
