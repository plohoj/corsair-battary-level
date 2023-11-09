## Corsair battery level

This script was written for personal use.
I wanted to get the charge level of my Corsair Void Pro wireless headphones,
and then display the last known battery level in Home Assistant (Using HASS.Agent).

I use the official [iCUE SDK](https://github.com/CorsairOfficial/cue-sdk) library to get the battery level

I used the npm library [koffi](https://www.npmjs.com/package/koffi) to call a method from a dll library, because other libraries perform self-compilation during initialization. I don't want to install Visual Studio tools on my computer
