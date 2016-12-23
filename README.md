# renova-bikes
--------------
Used bike listing with fit/sizing component.

### This project makes use of
* The [Agency Bootstrap Template](https://startbootstrap.com/template-overviews/agency/)
* Google Drive spreadsheet as the data source
* A simplified version of the [LeMond bike fit formula](http://myworldfromabicycle.blogspot.com/2010/05/lemonds-sizing-chart.html) to help customers pick the right size bike


### Change details
* Portfolio thumbnails were repurposed as bike thumbnails, triggering a bootstrap modal w/ more bike details.
* Gulpfile was modified to [use a source and destination directory](https://github.com/jericho1ne/renova-bikes/commit/9d093d4f6d368ef28c97799bc058cf8f303c104e).
* PHP files added to the `copy` task. 
* Browser live reload is now [triggered by all file changes](https://github.com/jericho1ne/renova-bikes/commit/dfe7bf79ca72c8da90f9eb16b5c79d9153c19c09), whether HTML, CSS, JS or PHP.


![Landing Page / Bike Listing / Detail Modal](/src/img/layout.jpg)
