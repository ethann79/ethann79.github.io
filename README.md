# Ethan Niu — editable portfolio

Source files for the Ethan Niu portfolio. The site is ready for static hosting, including GitHub Pages.

## Open it

Extract the ZIP first if needed. Open the portfolio folder, then double-click **index.html** in your browser. No installation or account connection is required. Keep JavaScript enabled and keep all the files together.

The temporary preview at http://127.0.0.1:4173/ works only while the local preview server is running. The saved index.html file can be opened after shutting down and restarting your computer.

## The layout

- **Home**: your greeting over silent Tokyo train footage, with one short sentence and a Projects button near the bottom.
- **Scroll down**: the video fades into the Tokyo subway map, with About, education, skills, contact details, and a resume section.
- **Projects**: a subtle white-and-grey geometric background with two editable project cards.
- **Project details**: an introduction and project facts above the full map; process and outcomes below it.
- The top navigation has **Home** and **Projects**, with a **Resume** button on the right.

The old about.html address simply redirects to the About section of Home. It is not a third navigation tab.

## Edit your text

1. Right-click **content.js** → **Open with → Notepad** (or your preferred text editor). Do not double-click the .js file on Windows; that may try to execute it.
2. Edit the text inside the quotation marks.
3. Save the file and refresh your browser.

Near the top of the file:

```js
"name": "Ethan Niu",
"program": "Your program",
"university": "Your university",
"introduction": "Maps, research, and projects that explore the places around us.",
```

`greeting` sets the short phrase above your name. `introduction` is the single sentence near the bottom of the video. The `about` paragraphs, education, skills, interests, and internship interests appear in the map section. These are placeholders until you replace them.

Keep the quotation marks, commas, and brackets. Use single quotes inside your sentences, or escape a double quote as `\"`. Use `\n` inside a string for a line break. If the site stops showing content after an edit, undo the last change and check for a missing quote or comma. Keep a backup of content.js before larger edits.

## Add the two projects later

Find the two objects inside `projects` in content.js. For each one, edit:

| Field | What to enter |
| --- | --- |
| title | Your project name |
| category | A short label such as Mapping or Research |
| year | When you completed it |
| summary | One sentence for the card and page introduction |
| cardSummary | Optional card-only text, such as `Coming soon` |
| context | Course, independent work, or team project |
| tools | Tools and methods you used |
| overview | The purpose or question, shown above the map |
| process | What you did, shown below the map |
| outcome | Findings, results, or lessons, shown below the map |

To add a map, put its PNG or JPG file into **assets**, then set:

```js
"image": "assets/my-map.png",
"previewImage": "assets/my-map-preview.jpg",
"imageAlt": "A useful description of what the map shows",
"caption": "Your caption, data source, and credits",
"pdf": "assets/my-map.pdf",
"liveUrl": "",
"sourceUrl": ""
```

Project 1 uses `toronto-accessibility-heatmap-preview.jpg` on its gallery card and embeds the complete qgis2web export from `assets/project-one-map/` on its detail page. Visitors can pan, zoom, and open the map in a full browser tab.

Project 2 now uses `fantasy-ttc-map.png` for its full-resolution map and `fantasy-ttc-map-preview.png` for its faster-loading gallery preview. Its `"zoomable": true` setting adds the interactive viewer automatically. Visitors can drag the map, zoom with a mouse wheel or the on-screen controls, use the arrow and plus/minus keys, and reset the view. The **Open original** link remains available for the untouched full-size image.

Only fill in pdf if that file exists. Use a public https:// address for an interactive map in liveUrl or a source-code page in sourceUrl. Empty links are not shown.

Your project maps are displayed without cropping. A project with `"zoomable": true` opens in the built-in pan-and-zoom viewer; other project images can still be clicked to open at full size. The Tokyo background map is decoration and is not presented as one of your own projects.

To add a third project later, duplicate one whole project object, give it a unique lowercase-hyphenated `id`, and separate it with a comma. Its detail page is created automatically. Rearrange the objects to rearrange the cards.

## Add your resume and contact links

Put your public-safe resume PDF into assets, then fill in the profile fields:

```js
"resume": "assets/resume.pdf",
"email": "your-email@example.com",
"linkedin": "https://www.linkedin.com/in/your-profile/",
"github": ""
```

Contact fields also accept convenient formats:

- `email`: one address, or multiple addresses separated by spaces, commas, semicolons, or the word `or`. Multiple addresses appear as separate links.
- `linkedin`: a full URL, a `www.linkedin.com/...` address, or your LinkedIn profile handle.
- `github`: a full URL or your GitHub username.
- `instagram` (or `Instagram`): a full URL or your Instagram username, with or without `@`.

The current resume is stored at `assets/Ethan-Niu-Resume.pdf`. Replace that file with an updated PDF using the same filename whenever the resume changes.

The Projects background is made entirely with CSS gradients and simple geometry; it does not use or reproduce the watermarked reference image. It needs no additional image download.
The sample email above is an instruction only; no fake address is included in the site. Leave fields empty until you have real links. Until a resume is added, the top-right button takes visitors to the clearly labelled resume placeholder on Home.

## Backgrounds and playback

The `backgrounds` section in content.js contains the video, poster, and map filenames. `videoPosition` and `mapPosition` adjust which part remains visible when the background is cropped to fill the screen. For example, `"60% 50%"` places the crop a little further right.

- **tokyo-trains.mp4**: a 20-second H.264 web loop from approximately 0:53–1:13 of your recording, with a one-second blend across the loop join. The audio track was removed from this web copy. It is 1920×1080 at 30 fps, about 21.5 MB, with HDR converted to standard SDR colour for browser playback.
- **tokyo-poster.jpg**: a still extracted from the web video. It appears before playback and when motion is disabled.
- **tokyo-subway-map.png**: a copy of the exact map you supplied. The source file was not modified.
- **social-preview.png**: a matching portfolio image prepared for link previews.

Your original MOV in Downloads was not changed. Sound could be added later by preparing another copy from that original.

The video has a small Pause/Play button. It pauses when the hero leaves view or the browser tab is hidden. People with reduced-motion or data-saving preferences start with the still image; they can explicitly choose Play. Reduced-motion mode also removes the animated scroll transition. Autoplay restrictions can cause the still image and Play button to appear instead; the rest of the site continues working.

## Appearance

The first lines of **styles.css** control the theme colors and fonts. Home has a full-height background; the project gallery uses a subtle white-and-grey geometric pattern, while project detail pages stay white. Text, cards, and navigation adapt to narrower screens. The backgrounds crop to fill the screen; the actual project maps do not crop.

The scroll transition uses normal scrolling and gradually adjusts background opacity over a slightly longer distance into About. No special mouse, scroll plugin, framework, or login is needed.

## Credits and publishing later

The supplied Tokyo rail map identifies **Jug Cerović / inat.fr**. A credit appears beneath the About panel, and the original credit remains in the map image. Before publishing publicly, verify that you have permission to use this particular map; including a credit does not by itself grant reuse rights.

Review all placeholder text and links, image descriptions, map data credits, and your resume's personal details before sharing. Keep sensitive or restricted files out of assets.

These files can be hosted on a static web host. This draft is not a content management system: saving content.js changes your local copy; a hosted copy must be updated separately. Page metadata updates in the browser from content.js. Before a public launch, finalize the static HTML metadata and absolute social-image URL for your real domain, since some social preview crawlers do not run JavaScript.

## Files

- index.html — Home, video, and About section
- projects.html — two-card project gallery
- project.html — reusable project detail page
- about.html — compatibility redirect to Home's About section
- content.js — personal text, project data, file paths, and contact links
- site.js — rendering, navigation, media controls, and scroll transition
- styles.css — colors, spacing, and layouts
- assets/ — backgrounds and your future project images/PDFs
- START-HERE.html — short visual editing guide
