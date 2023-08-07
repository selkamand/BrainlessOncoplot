# BrainlessOncoplot

![Static Badge](https://img.shields.io/badge/Experimental-orange)
![Static Badge](https://img.shields.io/badge/Not%20Ready%20for%20Use%20-%20red)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/selkamand/BrainlessOncoplot)
![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/selkamand/BrainlessOncoplot)


BrainlessOncoplot is a D3.js implementation of oncoplots/oncoprints designed to work as a the 'frontend rendering engine' to data processing backends that can be built in several languages (e.g. R/rust). 

Since it doesn't do any of the thinking, this implementation is 'brainless'


## Key Features

1) Supports Faceting of oncoplots by supplying gene -> pathway mappings
2) Supports optional TMB and gene barplots
3) Supports Visualisation of clinical features (both categorical and quantitative)


## Quick Start

This package is not designed to be used directly. Please generate oncoplots using one of the following packages

- **R**: d3Oncoplot
- **rust**: coming soon