---
title: Automatically generate PowerShell Markdown documentation - Part 1
tags:
  - PowerShell
  - Automation
  - Markdown
category: PowerShell
author: Jan-Henrik Damaschke
date: 2018-03-04 10:01:59
---

This blog series introduces a PowerShell module that automatically generated MarkDown documentation of your PowerShell Scripts and modules. It also gives an introduction into Abstract Syntax Trees (ASTs) in PowerShell.
<!-- more -->

This is a multi part article with the following parts:

* [Part 1 - Use Abstract Syntax Trees (ASTs) to parse PowerShell files](https://itinsights.org/Automatically-generate-PowerShell-Markdown-documentation-part-1/)
* [Part 2 - Using the EPS Module to generate Markdown documents](https://itinsights.org/Automatically-generate-PowerShell-Markdown-documentation-part-1/)

## Part 1 - Use Abstract Syntax Trees (ASTs) to parse PowerShell files

As we create a lot of PowerShell Scripts in our daily work with customers, we also need to create a lot of documentation.
Normally you would create a Word document or just write some inline comments. As our scripts became larger, we quickly identified that we needed a better solution for script documentation than manually creating word documents or creating a lot of inline comments.

We already have all our scripts checked in to our source control and our internal design patterns require to create a formal function header for all scripts, functions and modules that are created in customer and internal projects.
So how can we use these conditions to automatically generate a somewhat good looking documentation of our scripts? The answer is "Abstract Syntax Trees" (AST).
ASTs are the basic of PowerShell's parsing engine. Using ASTs we can simply generate a syntax description of our script and pick the parts we want to use to for example generate documentation as part of a build pipeline.
We will first take a look at the "[System.Management.Automation.Language]" .NET Namespace and will use it afterwards to get and work with the AST for our specific file.
The classes and methods we are going to use are:

* System.Management.Automation.Language.Parser
* System.Management.Automation.Language.FunctionMemberAst
* System.Management.Automation.Language.FunctionDefinitionAst
* System.Management.Automation.Language.CommentHelpInfo
* System.Management.Automation.Language.Ast

Classname | Description
--- | ---
Parser | This class is the most important one. We will use this class to parse script and module files and get a representation of the syntax tree of the inputs files. This can be used to extract information, but also to get an overview and dive deep into the internals of PowerShell. The parser returns Ast tokens and errors, if the script cannot be parsed successfully.
FunctionMemberAst | This class contains the definition for a defined method inside of the parsed script file.
CommentHelpInfo | This class contains the help content, specified by comments of script functions.
FunctionDefinitionAst | This class contains function definition representations.
Ast | This class ist just an abstract class for abstract syntax tree nodes.

To just get the Ast of a script file, we can use just a few lines of code:

```powershell
$tokens = $errors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile(
    $scriptFile,
    [ref]$tokens,
    [ref]$errors)
```

Now we have the parsed Ast of the file defined in `$scriptFile` in the `$ast` variable.
If we want to extract e.g. only function definitions, we could use the FindAll methods of the function class.

```powershell
$functionDefinitions = $ast.FindAll(
{
    param(
        [System.Management.Automation.Language.Ast] $Ast
    )
    $Ast -is [System.Management.Automation.Language.FunctionDefinitionAst] -and ($PSVersionTable.PSVersion.Major -lt 5 -or $Ast.Parent -isnot [System.Management.Automation.Language.FunctionMemberAst])
}, $true)
```

The FindAll method goes through the entire Ast and return all nodes for which the predicate (defined as first parameter) evaluates to true. The second parameter defined, if nested functions and script blocks should be searched.

Stay tuned for part 2, where we will use the EPS module to create a Markdown documentation based on our parsed Ast.
