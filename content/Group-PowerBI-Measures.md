---
title: Group PowerBI Measures
tags:
  - Office 365
  - PowerBI
  - Microsoft Power Platform
category: Office 365
author: Jacob Meissner
date: 2019-06-24 07:30:00
---

In Microsoft PowerBI, measures are created by default within the existing table. If you have a large data model with a lot of measures it can get very confusing. Here is a little trick how to improve your measures structures.<!-- more -->

First, we create a dummy table in the "Home" tab by clicking "Enter Data".
We can enter any value, number, letter, etc., no matter what. This is only used to create the table and will be removed afterwards.

::blogImage{src="posts/group-powerbi-measures/measure1.png" alt="Create dummy table "}
::

In the next step, after the table is created, we choose the measure that we want to move into the new table and select the new table as "Home Table" in "Modeling". This can be done with each measure.

::blogImage{src="posts/group-powerbi-measures/measure2.png" alt="Set home table "}
::

Last, we delete the previously created column "Column1" from the table and hide / unhide the report fields. Then after switching it to on again, it's displayed as Measures table.
