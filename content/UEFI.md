---
title: UEFI - A brief overview
tags:
  - UEFI
  - Security
  - BIOS
category:
  - Security
author: Frederik Junge
draft: true
date: 2020-04-04 22:58:17
---

There are a lot of discussion out there about UEFI keywords such as _Secure Boot_, _Signed OS_ and _BIOS successor_. Many of you have probably followed something about it or discussions about it. However, the background of this (in my opinion) important and complex topic is mostly only briefly or not mentioned at all. In this article I will try to go a bit further into detail about the boot process of a computer and what happens under the hood of your hardware...

<!-- more -->
<!-- toc -->

## BIOS

Let's start with the predecessor BIOS, the BASIC INPUT OUTPUT SYSTEM. It was developed by IBM about 30 years ago. The BIOS was created primarily as an interface between the hardware and the OS on x86 processor architectures. For a "normal" system start, the operating system must first be provided with the appropriate hardware for the boot. In addition, the various components of the computer require a control software (also known as a driver), which of course must also work with different hardware configurations. The BIOS is therefore to be regarded as a pre - operating system, which starts all hardware components and then passes them on to the OS with the appropriate driver.

### The boot process

Let us now go into detail: If the computer is booted with a reset x86 processor (cold start), the instruction counter jumps to the permanently integrated memory of the BIOS on the mainboard. It commands the system to execute the startup code (POST). POST stands for "Power-On Self-Test". As the name suggests, POST is a program that checks all basic hardware for errors and accessibility and is intended to protect the operating system. POST runs a strict list of tests that check the various components. This starts with the processor (in a multicore architecture only the first one) and then goes through the RAM and the graphics card to input devices and so on. If the program finds errors, it passes them on in the form of visual (and if the graphics card has not yet been started, acoustic) signals. POST ends the test by searching existing storage media for the so-called Master Boot Record (MBR). The MBR contains a partition table with the bootable sectors and the machine code that starts the boot loader. The boot loader (the colloquial short form of bootstrap loader) now loads the kernel and other components from the active partition into the hardware, thus initializing the actual startup process of the operating system.

### Limitations

Due to its age, this system has some limitations. When IBM developed the BIOS in 1981, some developments in computer technology could not yet be foreseen. So, the BIOS can address hard disks with a maximum of 2.2 TB and integrate them into the OS. Furthermore, in the opinion of many users, output with the beautiful DOS layout was no longer up to date in the 21st century. Therefore, the large BIOS manufacturers sat down at the beginning of 2004 under the initiative of Intel together and decided to create the standard EFI. The Extensible Firmware Interface was renamed to (United)EFI in 2005 for marketing reasons to underline the cooperation of the different manufacturers for compatibility.

## UEFI features

UEFI can be seen an evolution, i.e. the successor of the BIOS, and not as a revolution. The situation of Systems has been preserved and the initialization of the operating system is still the primary task of the new UEFI. However, the manufacturers have optimized some components and integrated additional features, which are also noticed by the user. The obvious innovations are the very fast loading times of both UEFI and the operating system. In addition, the more colorful GUI and the now possible mouse operation make it easier for the user to work with the pre - operating system. On the technical side, however, the innovations are more extensive, a brief overview below:

- The GUID Partition Table (GPT) replaces the master boot record explained above. As explained above, the MBR can only mount storage media up to 2.2 TB in the OS due to its age and is therefore no longer up-to-date. The GPT can manage a theoretically unlimited number of partitions (as opposed to the 4 partitions of the MBR) with a maximum size of up to 18 Exabyte.
- The Compatibility Support Module (CSM) was integrated, because 32Bit and many older operating systems with UEFI do not know. The module emulates the OS a BIOS and presents itself to the user also with the typical DOS display.
- The EFI Shell is a command line interface to the firmware.
- The typical bootloader is no longer necessary for a Windows installation because UEFI now comes with its own boot module. However, this does not apply to other operating systems; here the manual integration of boot loaders like GRUB is sometimes necessary.

The best-known example is probably the Secure Boot, which is often controversially discussed in forums. Secure Boot is a new security feature of UEFI, which is intended to prevent unwanted booting of (defective) operating systems. In this mode, the UEFI only transfers control to the OS if the OS or its boot loader is signed with a key. Windows 8(.1) and some Linux distributions are able to use Secure Boot using certified keys. However, there was the accusation that Microsoft wanted to prevent the use of other operating systems with this feature, because signing its bootloader is costly and thus blocks the way for many OpenSource projects. Thus Secure Boot can also be deactivated, e.g. to boot tools from an external storage medium.

## System bypass

However, by booting from external storage media, the normal logon procedure of known OS can be bypassed by using external software. These programs are called bootkits (similar but different to rootkits. Bootkits have become increasingly popular in recent years and are a popular means of infiltrating other computers independent of the operating system. Two of the best known bootkits are the Stoned Bootkit and Konboot. We would like to take a brief look at how Konboot works to point out the advantages of Secure Boot. Konboot is initialized from an external storage medium and manipulates the startup process of UEFI/BIOS. As soon as the program has written itself into memory with this pre-boot attack, Konboot modifies the kernel of the operating system and then subverts the authentication/logon routines when the system is booted. This allows someone to penetrate the system unnoticed and execute any malicious code. At this level, the PC is still heavily dependent on the started services and has no possibility to control the different modules. With the Secure Boot, the UEFI is mistrusting every bootable partition and is thus supposed to prevent the infiltration of malware with the help of trust (signed boot loader).

## Summary

To summarize it: BIOS is outdated after more than 30 years of operation and has many limitations and security holes. UEFI is the logical new development of this system and offers the user many advantages under modern hardware and operating system. It will probably remain the standard for the next decade.
