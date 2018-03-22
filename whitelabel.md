# How to whitelabel

## Domain recognition

The application automatically recognizes the client by the subdomain name.
The subdomain is extracted and spit by `-` characters. Then each component is matched against
a black list, consisting of the following entries:
```
['app', 'testing', 'development', 'staging', 'production', 'tracking', 'coureon', 'localhost', 'www']
```
The first component of the subdomain _not_ blacklisted is recognized as the client. Fallback
client is always `coureon`.

### Domain recognition examples:

```
https://tracking.coureon.com -> coureon
https://tracking-staging.coureon.com -> coureon
http://localhost:3000 -> coureon
https://misterspex.coureon.com -> misterspex
https://tracking-misterspex.coureon.com -> misterspex
https://tracking-misterspex-staging.coureon.com -> misterspex
```

## Adaptions on the page

A css class `theme theme--{{client}}` is added to the body of the html. That way, styling with css is easy.
Have a look in the `assets/css/themes` folder for examples.

For logos and other images, there is an `assets/images/whitelabel` folder.
If the client is not coureon, the site automatically attempts to load a logo from `/images/whitelabel/{{client}}.svg`
and a background image from `/images/whitelabel/{{client}}-background.jpg`. Please make sure that these two files exist for your client.

If the client is not `coureon`, the bottom banner is hidden automatically and the terms and conditions link is hidden.
Also, your clients name is prepended to the header and footer URL translation keys, e.g. like this:
`MISTERSPEX.LOGO_LINK`, `MISTERSPEX.IMPRINT_LINK`