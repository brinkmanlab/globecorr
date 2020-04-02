---
title: Tutorial
slug: tutorial
nav: 2
---
# {{ $attrs.title }} 


GlobeCorr is a data visualization software developed to facilitate the viewing and analysis of multiple correlation datasets. To enable further, dynamic exploration of your data, users can upload a table of correlations in csv format and GlobeCorr provides an interactive and customizable “globe-based” visualization.  

The domains specified your csv will be shown around the circumference of the globe. Each domain will be present as a distinct arc with a unique colour. Correlations are represented as ribbons. When there are correlations between variables within the same domain, you will see the ribbon tracing back onto its domain of origin. When correlated variables are in separate domains, the ribbons will arrange as needed across the circle to reach the required domain. The variables specified in the csv for the  correlations can be viewed by hovering over each ribbon. The default colour for positive correlations is blue, whereas the default for negative is red. GlobeCorr defaults to showing on those correlations above 0.4. 

GlobeCorr users can customize their image by changing: 
* default correlation threshold 
* colour of positive and negative correlation ribbons 
* opacity of the correlation ribbons 
* arrangement of domains around the circumference 

To explore GlobeCorr, you can download one of our [sample datasets](/sample_small.csv), view the correlation globe [directly](/globe?view=%2Fsample_small.csv), or read our [tutorial](/tutorial) for more information.

Please see our [FAQ](/faq) for more information.  


## **1. Upload your data**

To upload data, click the "Upload data to visualize" bar at the top of the page. 

GlobeCorr requires a 5 column dataset in .csv format. There are required headings for each of the columns, which are shown below. 
If you would like an example, feel free to download one of our [sample datasets](/sample_small.csv). 

+ **Column 1:** variable1
+ **Column 2:** var1_domain
+ **Column 3:** variable2
+ **Column 4:** var2_domain
+ **Column 5:** coef


After loading your data, the image will render automatically. 

## **2. Customize your view**

**Change what correlations are shown** 

- Change the correlation threshold for the globe by hovering over the "Globe Options" <i class="v-icon mdi mdi-tune" style="background-color:#1976d2;color:white;"></i> menu on the right hand side of the screen. Use the slider to select your desired threshold. You can also click on the box to the right of the slider and type in the desired threshold. The visualization will update automatically. 

- To remove domains from the visualization, click on its location at the circumference. The correlation ribbons will disappear, but a small grey box will remain at the circumference representing the hidden domain should the user want to include those correlations again. 

- To explore all correlations within a specific domain, hover over the domain on the circumference of the circle and all correlations within that domain will go from transparent to opaque. 

![Domain Hover Example2](/public/tutorial/corr_domain.png)


- To explore specific correlations, hover over the ribbons on the interior of the circle to see the variable and their corresponding correlation coefficient. 

**Layout and colouring**

- The orientation of the domains around the circumference of the circle can be changed by clicking the domain and dragging. However, you will need to move other domains to accomodate the changes. It is possible to have domains overlapping. 

- To update the colour of the ribbons shown in the globe, hover over the "Globe Options" <i class="v-icon mdi mdi-tune" style="background-color:#1976d2;color:white;"></i> menu on the right hand side of the screen. To change the colours for positive corrlations, click "Positive Correlation Colour". You can select using the slider or by selecting a colour on the palette. The colour will change automatically. The user can also specify opacity using the bottom slider. To change the colours for negative corrlations, click "Negative Correlation Colour". You can select using the slider or by selecting a colour on the palette. The colour will change automatically.The user can also specify opacity using the bottom slider.

 ## **3. Save your results** 

- To save the image, hover over the "Globe Options" <i class="v-icon mdi mdi-tune" style="background-color:#1976d2;color:white;"></i> menu on the right hand side of the screen. Click on the "Export" button and select an output format. After selecting an export format the download will start automatically and the file name will be taken from the file name of the input dataset. 

- To send the image directly to the printer hover over the "Globe Options" <i class="v-icon mdi mdi-tune" style="background-color:#1976d2;color:white;"></i> menu on the right hand side of the screen. Click on the "Export" button, then click "Send to printer" and follow the instructions for your printer. 

