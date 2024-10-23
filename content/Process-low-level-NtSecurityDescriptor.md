---
title: Process low level NtSecurityDescriptor
author: Jan-Henrik Damaschke

date: 2019-02-14 19:07:02
tags:
 - Active Directory
 - Security
 - Forensics
category: Security
keywords:
 - Security
 - Active Directory
 - ADDS
 - Certificate Services
 - AD
 - Security Descriptor
 - Forensics
---

The SECURITY_DESCRIPTOR structure stores security related attributes of an object. It determines, who can access the object and which additional permissions are assigned. Because sometimes you are confronted with the "raw" NtSecurityDescriptor e.g. in Active Directory related scenarios, I tried give an overview about all parts of it.
<!-- excerpt -->
<!-- toc -->

## Introduction

The SECURITY_DESCRIPTOR structure stores security related attributes of an object. It determines, who can access the object and which additional permissions are assigned. The security descriptor itself also manages the audit options to monitor who can access what and when it took place. That leads to event IDs like 4907. This is e.g. used in Active Directory for permission management, which can be directly accessed through ADSI with e.g. PowerShell. In that case, the SecurityDescriptor and its parts like DACLs and SACLs, appear as instantiated classes.

Sometimes the NtSecurityDescriptor has to be used in raw format. This appears for example if you export ADCS Templates with certutil -v -dstemplates. That leads to an raw export of every template whichs also includes the ntsecuritydescriptor field for every entry. This field is described in \[MS-DTYP\] 2.4.6 as the datastrcture SECURITY_DESCRIPTOR. The field is encoded in hex and cannot directly converted to a Security Descriptor type. It can still be achieved by writing the descriptor into a byte array and pass it to the constructor of the RawSecurityDescriptor class. With PowerShell thats just a few lines of code:

{% gist 8ccd66b2e41319511d51 %}

Because sometimes you are confronted with the "raw" NtSecurityDescriptor e.g. in Active Directory related scenarios, I tried give an overview about all parts of it. I found nearly zero information to that so I downloaded all required standards from the Microsoft resource center and went through the properties one by one.

## Structure details

As a start we have the following example block:

```
    nTSecurityDescriptor =
            01 00 04 9c 00 00 00 00  00 00 00 00 00 00 00 00   ................
            14 00 00 00 04 00 d4 00  05 00 00 00 05 00 38 00   ..............8.
            30 01 00 00 01 00 00 00  68 c9 10 0e fb 78 d2 11   0.......h....x..
            90 d4 00 c0 4f 79 dc 55  01 05 00 00 00 00 00 05   ....Oy.U........
            15 00 00 00 93 28 44 63  71 b3 98 61 85 a9 0c 5c   .....(Dcq..a...\
            00 02 00 00 05 00 38 00  30 01 00 00 01 00 00 00   ......8.0.......
            68 c9 10 0e fb 78 d2 11  90 d4 00 c0 4f 79 dc 55   h....x......Oy.U
            01 05 00 00 00 00 00 05  15 00 00 00 93 28 44 63   .............(Dc
            71 b3 98 61 85 a9 0c 5c  07 02 00 00 00 00 24 00   q..a...\......$.
            ff 00 0f 00 01 05 00 00  00 00 00 05 15 00 00 00   ................
            93 28 44 63 71 b3 98 61  85 a9 0c 5c 00 02 00 00   .(Dcq..a...\....
            00 00 24 00 ff 00 0f 00  01 05 00 00 00 00 00 05   ..$.............
            15 00 00 00 93 28 44 63  71 b3 98 61 85 a9 0c 5c   .....(Dcq..a...\
            07 02 00 00 00 00 14 00  94 00 02 00 01 01 00 00   ................
            00 00 00 05 0b 00 00 00                            ........
```

To get only the hex part of the $ntsecdesc variable without spaces and breaks, I used the following PowerShell line:

```
$hex = [regex]::Matches([regex]::Match($ntsecdesc,'nTSecurityDescriptor\s=(.*?|\n)+05 0b 00 00 00').Value,'(?:[0-9a-fA-F]{2}\s[0-9a-fA-F]{2}\s)+')|% {$_.Value}
-split($hex) -join''
```

Now you get this hex string:

```
0100049c000000000000000000000000140000000400d4000500000005003800300100000100000068c9100efb78d21190d400c04f79dc550105000000000005150000009328446371b3986185a90c5c0002000005003800300100000100000068c9100efb78d21190d400c04f79dc55
0105000000000005150000009328446371b3986185a90c5c0702000000002400ff000f000105000000000005150000009328446371b3986185a90c5c0002000000002400ff000f000105000000000005150000009328446371b3986185a90c5c07020000000014009400020001010000
000000050b00
```

### **NtSecurityDescriptor „Header“**

Let's start with the header. The Security Descriptor has fixed and variable length parts, like the SID. First, the fixed length structures are handles, which consists (regarding to [\[MS-DTYP\]](https://msdn.microsoft.com/en-us/library/cc230273.aspx) 2.4.6) of Revision, Sbz1, Control, OffsetOwner, OffsetGroup, OffsetSacl and OffsetDacl.

```
0100049c00000000000000000000000014000000
```

That string can be split further:

Hex | Title | Description
--- | --- | ---
01 | Revision
00 | Sbz1
049c (9c04) | Control | 1001 1100 0000 0100‬ = ‬Self-Relative (SR), DACL Protected (PD), SACL Auto-Inherited (SI), DACL Auto-Inherited (DI), DACL Present (DP)
0000000 | OffsetOwner
00000000 | OffsetGroup
00000000 | OffsetSacl
14000000 (14) | OffsetDacl | Dacl Offset from string start. Here 14h = 20.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Be aware that the byte-order is little-Endian
::

So there is one Dacl, directly after 4 bytes OffsetDacl property (regarding to the offset).

### **ACL Header**

The following 8 bytes are the ACL header. Regarding to [\[MS-DTYP\]](https://msdn.microsoft.com/en-us/library/cc230273.aspx) 2.4.5 it consists of ACL Revision, Sbz1, Acl Size, Ace Count and Sbz2.

Hex | Title | Description
--- | --- | ---
04 | ACL Revision | ACL_REVISION_DS (only ADDS objects and only types 0x05, 0x06, 0x07, 0x08, and 0x11 allowed)
00 | Sbz1 | Reserved
d400 (00d4) | Acl Size in bytes
0500 (0005) | Ace Count | 5 Entries
0000 | Sbz2 | Reserved

The ACE count is an important field as it makes undestanding of the following list much more easier.

### **ACE Header**

The ACE Header consists of 4 bytes. Regarding to [\[MS-DTYP\]](https://msdn.microsoft.com/en-us/library/cc230273.aspx) 2.4.4.1 it consists of ACE Type, Flags and Ace Size.

Hex | Title | Description
--- | --- | ---
05 | Ace Type | ACCESS_ALLOWED_OBJECT_ACE_TYPE
00 | Ace Flags | No Flags |
3800 (0038) | Ace Size in Bytes | 56 Bytes

Based on the Ace type ACCESS_ALLOWED_OBJECT_ACE_TYPE, it comes clear that Mask, Flag and ObjectType follow as additional fields. That is decribed in [\[MS-DTYP\]](https://msdn.microsoft.com/en-us/library/cc230273.aspx) 2.4.4.3.

### **ACE Mask**

The next structure is the ACE Mask. It is 32 Bit long and is will be interpreted in binary. Every bit stands for a flag. The AccessMask is often listed in decimal (in our case 304) with uint32 as type.

```
0x30010000 (00000130) = 0000 0000 0000 0000 0000 ‭0001 0011 0000
```

With the help of the the diagram from [\[MS-ADTS\]](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/990fb975-ab31-4bc1-8b75-5da132cd4584) 5.1.3.2 the set flags can be examined:

Shortcut | Title | Description
--- | --- | ---
RP | RIGHT_DS_READ_PROPERTY | The right to read properties of the object
WP | RIGHT_DS_WRITE_PROPERTY | The right, to write to object properties
CR | RIGHT_DS_CONTROL_ACCESS | GUID rule (here Enroll) also called control access right which is "An extended access right that can be granted or denied on an ACL"

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Also be aware of the byte-order
::

This has the first "clue" that the structure we are looking at is the extended version, inclusive flags and object type. As the CR flag is set, there must be a GUID following that describes the extended permissions. So next up is the flag attribute, defined in [\[MS-DTYP\]](https://msdn.microsoft.com/en-us/library/cc230273.aspx) 2.4.4.3:

```
01000000 (00000001)
```

There are three possibilities for this field. The first is 00000001, as in this ACE, meaning there is a ObjectType field existent. The second is 00000002, meaning there is a InheritedObjectType existing. The third one, 00000003, means that both field are existent.

### **ObjectType**

The field ObjectType is a GUID structure, a 16 bytes long field with 8 hex characters followed by three groups with 4 hex characters each and finally a group of 12 hex characters. It's important for the byte order to know how the GUID is construted. Internally the structure is intepreted as a combination of one integer (32bit), two shorts (16bit) and one byte array with a size of 8. The split into 5 segments is based on the UUID when is was generated from timestamp and MAC.

```
68c9100efb78d21190d400c04f79dc55 (0e10c968-78fb-11d2-90d4-00c04f79dc55)
```

Value | Type | ordered
--- | --- | ---
68c9100e | Dword | 0e10c968
fb78 | Word | 78fb
d211 | Word | 11d2
90d400c04f79dc55 | 8 bytes array

This ObjectType may be familiar. Regarding to [\[MS-ADTS\]](https://msdn.microsoft.com/en-us/library/cc223122.aspx) 5.1.3.2.1 and 6.1.1.2.7.26 this is the „Extended Right“ Enroll type, which normally only appears in ADDS context.

### **Security identifier (SID)**

The next field after ObjectType is the SID.

```
0105000000000005150000009328446371b3986185a90c5c00020000
```

The four zeros at the end are padding, to get to 32 Bit. The SubAuthority field (150000009328446371b3986185a90c5c00020000) is an array of 32bit values. Regarding to SubAuthorityCount these are 5 values, meaning 20 Bytes (160 Bit).

The next structure is the second ACE. Except for the last SubAuthority it's the same as the first one. The field is 07020000 (519) instead of 00020000 (512).

### **Remaining ACEs**

There are still 3 ACEs to go. The next two each have the same AccessMask for a seprate SID.

The ACE header is a little bit different. It still consists of 4 Bytes, but this time without an ObjectType.

Hex | Title | Description
--- | --- | ---
00 | Ace Type
00 | Ace Flags | no flags
2400 (0024) | Ace Size in Bytes | 24 Bytes

```
ff000f00 (000f00ff) = 0000 0000 0000 ‭1111 0000 0000 1111 1111
```

With the help of the referenced AccessMask table the rights can be determined. The first 4 rights are standard objects which are existent in all objects.

Shortcut | Title | Description
--- | --- | ---
WO | RIGHT_WRITE_OWNER | Default right to change owner
WD | RIGHT_WRITE_DAC | Default right to change the DACL
RC | RIGHT_READ_CONTROL | Default right to read the SecurityDescriptor
DE | RIGHT_DELETE | Default right to delete the object
LO | RIGHT_DS_LIST_OBJECT | Right to list object
DT | RIGHT_DS_DELETE_TREE | Right to perform „Delete-Tree“ operation on the object
WP | RIGHT_DS_WRITE_PROPERTY | Right to change object properties
RP | RIGHT_DS_READ_PROPERTY | Right to read object properties
VW | RIGHT_DS_WRITE_PROPERTY_EXTENDED
LC | RIGHT_DS_LIST_CONTENTS | Right to list sub-objects
DC | RIGHT_DS_DELETE_CHILD | Right to delete sub-objects
CC | RIGHT_DS_CREATE_CHILD | Right to create sub-objects

### **Authenticated Users**

The last ACE is also a ACCESS_ALLOWED_ACE. The AccessMask is also different, as these are the default Authenticated Users rights.

```
94000200 (00020094) = 0000 0000 0000 0010 0000 0000 1001 0100
```

Shortcut | Title | Description
--- | --- | ---
RC | RIGHT_READ_CONTROL | Default right to read the SecurityDescriptor
LC | RIGHT_DS_LIST_CONTENTS | Right to list sub-objects
LO | RIGHT_DS_LIST_OBJECT | Right to list object
RP | RIGHT_DS_READ_PROPERTY | Right to read object properties

The last field is the Well-Known SID structure for AUTHENTICATED_USERS (S-1-5-11).

```
01010000000000050b00
```

## Overview

Here is the summary of everything I have collected:

### NtSecurityDescriptor Header ###

01 # Revision
00 # Sbz1
049c # (9c04) Control
00000000 # OffsetOwner
00000000 # OffsetGroup
00000000 # OffsetSacl
14000000 # OffsetDacl

### ACL Header ###

04 # ACL Revision
00 # Sbz1
d400 # (00d4) Acl Size in bytes
0500 # (0005) Ace Count = 5
0000 # Sbz2

### ACE Header ###

05 # Ace Type = ACCESS_ALLOWED_OBJECT_ACE_TYPE
00 # Flags = 0
3800 # (0038) Ace Size = 56

### ACE Mask ###

30010000 # (0130) ACE Mask = ‭0000 0000 0000 0000 0001 0011 0000 ‬0000
01000000 # (00000001) Object ACE Flag

68c9100e # 0e10c968 # Dword
fb78 # 78fb # Short
d211 # 11d2 # Short
90d400c04f79dc55 # Byte Array

0105000000000005150000009ace697cb9b3986185a90c5c00020000 # SID

### ACE Header ###

05 # Ace Type = ACCESS_ALLOWED_OBJECT_ACE_TYPE
00 # Flags = 0
3800 # (0038) Ace Size = 56

### ACE Mask ###

30010000 # (0130) ACE Mask = ‭0000 0000 0000 0000 0001 0011 0000 ‬0000

01000000 # Flags

68c9100e # 0e10c968 # Dword
fb78 # 78fb # Short
d211 # 11d2 # Short
90d400c04f79dc55 # Byte Array

0105000000000005150000009ace697cb9b3986185a90c5c07020000 # SID

### ACE Header ###

00 # Type
00 # Flags
2400 # Size

### ACE Mask ###

ff000f00 # (000f00ff) ACE Mask = 0000 0000 0000 ‭1111 0000 0000 1111 1111‬

0105000000000005150000009ace697cb9b3986185a90c5c00020000 # SID

### ACE Header ###

00 # Type
00 # Flags
2400 # Size

### ACE Mask ###

ff000f00 # (000f00ff) ACE Mask 0000 0000 0000 ‭1111 0000 0000 1111 1111‬

0105000000000005150000009ace697cb9b3986185a90c5c07020000 # SID

### ACE Header ###

00 # Type
00 # Flags
1400 # Size

### ACE Mask ###

94000200 # (00020094) ACE Mask 0000 0000 0000 0010 0000 0000 1001 0100

01010000000000050b00 # SID

## Summary

I hope I could provide some insights into the NtSecurityDescriptor structure. Keep in mind that the structure will always be a little bit different because of the variable length and optional fields.
When you start dissecting structures like this, try to get all the documentation you can get, keep calm, structured and avoid trouble with the byte order (cost me a lot of time).
For everything Microsoft related, wether you want to reverse something, make some research or if you are just curious, take a look at the Microsoft Open Specifications **[HERE](https://msdn.microsoft.com/en-us/library/dd208104.aspx)**.
