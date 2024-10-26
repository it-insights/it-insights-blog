---
title: German special characters (umlauts) with AutoHotkey
tags:
  - AutoHotkey
  - Scripting
  - Automation
  - Productivity
  - Windows
author: Jan-Henrik Damaschke
date: 2019-06-26 07:15:00
category:
  - Automation
---

If you are like me from Germany, but used to writing on a EN-US or EN-GB keyboard layout, you probably ran into the problem of writing special characters like "ä", "ü" or "ß".
This is why I searched for a more simple solution then changing the layout with WIN+SPACE frequently.

<!-- more -->

For me the best solution was an AutoHotkey script. AutoHotkey is great for several reasons:

- It can be interpreted or compiled and used as an executable (ok, this has also security implications, but let's ignore them for this post)
- It is extremely easy to learn and to write but also has the tools for complex scenarios
- It has a great community to help out

You can find the download and more information on their official site: [AutoHotkey Website](https://www.autohotkey.com)

So first I wrote down the characters I frequently use:

- ä/Ä
- ü/Ü
- ö/Ö
- ß
- €

Then I searched for a shortcut that has the least possible overlap with the programs I use daily like VSCode and the Office suite.
For me this combination was `Ctrl` + `Alt` + {letter}. Where the letter is u for ü, o for ö, etc..
It was only intuitive to choose the same combination just with the addition of `Shift` for uppercase.

This is what the basic AHK script looked like:

{% ghcode <https://gist.github.com/itpropro/29d6cc771cd42db17709e51e4426644c> {lang:bash} %}

The first part of the script is mainly for testing and developing of the AHK script. You probably don't need it, once you are finished.
The `OSD(text)` part from line 14 onwards is mainly for testing and using media buttons and emulating OSD's. Just drop it, if you don't need media interaction.
I also added some AutoHotkey shortcuts for media buttons starting at line 72 (next/previous track).

If you need additional special characters, just use the existing ones as template, save the script and be more productive!

::callout{icon="i-heroicons-information-circle" color="blue"}
If you need the script at startup, just take the compiled exe and throw it in you "Startup" folder at shell:startup.
::
