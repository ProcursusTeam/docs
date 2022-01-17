<!-- markdownlint-disable-file MD041 -->

# Procursus

[Homepage](https://procurs.us/) | [Discord](https://discord.gg/QJDrrAJPDY) | [Twitter](https://twitter.com/procursusteam)

A new, powerful, cross-compilation *OS bootstrap. At its core, Procursus is a build-system that provides a large set of consistently up-to-date \*nix tools cross compiled to work on Darwin based platforms.

The build-system is built in a manner where maintenance of packages is fairly simple, helping to not fall behind upstream.

## History

At its birth, this build-system was meant to be an APT repository included in a specific jailbreak. However, that never came to pass, turning the project into a hobby.

In the iOS jailbreak scene, Procursus attempts to address an odd fragmentation problem seen over the past couple of years. Many new APT repositories have arisen from the ashes of Saurik's Telesphoreo, both with their respective flaws. One of the main issues is that each repository is targeted to one specific jailbreak.

Procursus attempts to circumvent this by excluding hooking platforms or packages that provide code-injection, providing a "plug-and-play" experience for anyone who decides to use it on their specific project. In the context of iOS jailbreaks, this allows developers to provide and maintain their own hooking libraries, while we maintain core, system packages separately.

## Features

Here are a few changes over other existing build-systems

- Based on Makefiles, allowing parallel package building that is much quicker while also making easier to add new packages
- Fully open-sourced (utilizing GNU tools) and open to community contribution. See [Contributing](#Contributing)
- No jailbreak-specific software, making it easier to implement with other projects
- **First ever build-system** to be fully functional with any one of the main 4 package managers out of the box (e.g Sileo, Zebra), making easier to switch to your preferred package manager
- Better Objective-C implementation of ``firmware.sh`` that's not only quicker, but also based on CPU subtype (e.g ``cy.cpu.arm64e``)

## Contributing

Contributions (Issues or Pull Requests) are welcome with open arms. Check out the [contribution guidelines](./Contribution.md) before helping out.

## Credits

Build system created by [Diatrus](https://twitter.com/Diatrus) and [hbkirb](https://twitter.com/hbkirb), and brought to greater heights by all our wonderful contributors. And of course, this project is made worth it by people like you!

## Our Sponsors

[![Vercel Logo](https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg)](https://vercel.com/?utm_source=procursusteam&utm_campaign=oss) [![MacStadium Logo](images/MacStadium_Logo.png)](https://www.macstadium.com/) [![Tutanota Logo](images/tutanota-logo-red.svg)](https://tutanota.com/)
