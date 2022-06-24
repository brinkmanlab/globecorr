---
title: FAQ
slug: faq
nav: 3
---
# {{ $attrs.title }} 
**What input file format do I need to use?**  
GlobeCorr takes csv files. If you are using other file formats, such as .xlms, .xlsx or .txt the image will not render. Please convert the file to .csv and consult the [tutorial](#/tutorial) for further instructions. 

**Will my image not generate if I have more than 5 columns?**  
 As long as the data in the first 5 columns is as specified in the [tutorial](#/tutorial) then the image will render and the additional columns will be ignored. 

**The domain labels wrap in my image, what can I do to fix this?**  
This can depend on the size of the your screen. We are currenty working to get the diagram to render relative to the screen size of the user. However, it is best practice to avoid long domain names. 

**Can I run GlobeCorr locally?**  
GlobeCorr is already running locally, we are not storing any data on our servers. You can also run GlobeCorr offline. See the following links for how to execute this in [Chrome](https://support.google.com/chrome/answer/7343019?co=GENIE.Platform%3DDesktop&hl=en) or [Safari](https://support.apple.com/en-ca/HT200294). 

**Can I share an interactive view instead of a static image?**  
To do this, you will need to provide other users the csv you are using and they will have to upload it to GlobeCorr themselves. To replicate any customizations use the 'Quick Settings' feature as specified in the [tutorial](#/tutorial). 

**I want to customise the look of my globe beyond what is provided**  
You can change nearly any aspect of the globe by downloading it in SVG format and manipulating it using your preferred vector graphics software.
[Inkscape](https://inkscape.org/) is a popular free vector graphics program that should suit your needs. See the Inkscape [tutorial](https://inkscape.org/doc/tutorials/basic/tutorial-basic.html) for more information on its use.

**My globe isn't loading properly**
This may be a limitation of your computer/browser when handling larger datasets. Try reducing your dataset or try viewing the globe on a computer with higher performance.
