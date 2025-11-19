---
layout: page
title: Style Guide
parent: The Commit Button Widget
nav_order: 2
---

# Commit button style guide

### Overview <a href="#overview" id="overview"></a>

The Boson Commit button has some default designs but it can be customised by changing the parameters in `buttonStyle`.

```html
<div id="container"></div>

<script>
  const instance = CommitButton({
    /* ... */
    disabled: false,
    buttonStyle: {
      layout: "horizontal",
      minWidth: "100px",
      minHeight: "100px",
      shape: "rounded",
      color: "white"
    },
    /* ... */
  });

  instance.render("#container");
</script>
```

#### Layout <a href="#layout" id="layout"></a>

Set the `buttonStyle.layout` option to determine the button layout of the text and the Boson logo:

<table><thead><tr><th width="150">Value</th><th valign="top">Result</th></tr></thead><tbody><tr><td><code>horizontal</code></td><td valign="top"><div><figure><img src="/interface/assets/image (5).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr><tr><td><code>vertical</code></td><td valign="top"><div><figure><img src="/interface/assets/image (6).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr></tbody></table>

#### Color <a href="#color" id="color"></a>

Set the `buttonStyle.color` option to one of these values:

<table><thead><tr><th width="150">Value</th><th>Result</th></tr></thead><tbody><tr><td><code>green</code></td><td><div><figure><img src="/interface/assets/image (7).png" alt="" width="200"><figcaption></figcaption></figure></div></td></tr><tr><td><code>black</code></td><td><div><figure><img src="/interface/assets/image (8).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr><tr><td><code>white</code></td><td><div><figure><img src="/interface/assets/image (9).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr></tbody></table>

#### Shape <a href="#shape" id="shape"></a>

Set the `buttonStyle.shape` option to one of these values:

<table><thead><tr><th width="150">Value</th><th>Result</th></tr></thead><tbody><tr><td><code>sharp</code></td><td><div><figure><img src="/interface/assets/image (10).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr><tr><td><code>rounded</code></td><td><div><figure><img src="/interface/assets/image (11).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr><tr><td><code>pill</code></td><td><div><figure><img src="/interface/assets/image (12).png" alt="" width="202"><figcaption></figcaption></figure></div></td></tr></tbody></table>

#### Size <a href="#size" id="size"></a>

Set the `buttonStyle.minWidth` and `buttonStyle.minHeight`:

<table><thead><tr><th width="150">Property</th><th width="149.5">Value</th><th>Result</th></tr></thead><tbody><tr><td><code>minWidth</code></td><td><code>500px</code></td><td><div><figure><img src="/interface/assets/image (13).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr><tr><td><code>minHeight</code></td><td><code>80px</code></td><td><div><figure><img src="/interface/assets/image (14).png" alt="" width="201"><figcaption></figcaption></figure></div></td></tr></tbody></table>

