# Discord Level Helper

![build](https://github.com/hackermondev/Discord-Level-Helper/workflows/build/badge.svg)

A chrome extension to help you level up on Discord servers using [MEE6](https://mee6.xyz) bot faster!

## Introduction

I enjoy grinding on discord servers to earn more levels/xp on MEE6 but sometimes it is really hard to grind. Basically the way MEE6 leveling works is by giving you a certain amount of XP per message every minute. Most people don't understand the "every minute' part. This means if you send 50 messages in one minute, you will only earn XP for one of those message. This is really annoying in some sitatuions when you're really active but MEE6 only gives you XP for one message. This extension doesn't bypass that and instead puts a timer on your Discord client which tells you the next time you should send a message and the extension tells you how much XP you earned from a message when you send it.


## What it does

This extension will puts a timer on your Discord client which tells you the next time you should send a message to earn XP on the MEE6 bot and the extension tells you how much XP you earned from a message when you send it.

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)
* [typescript](https://typescriptlang.org)

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

Since I am a small developer and I can't publish this on Chrome Web Store, you have to load it into your Google Chrome. Read [this](docs/SETUP.md)

## Contributing
Found a bug you can fix? Clone the repo, fix the bug and create a new pull request! Remember to run ``npm test`` and ``npm run style`` after you're done with fixing the issue! (Remember to tag me in your pull request ``@hackermondev``)

## Roadmap

*Some things I might add later*

* Add support for other bots like Arcane and more!
