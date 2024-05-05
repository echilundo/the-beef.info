---
company: "The Story of Adidon"
role: "Pusha T"
dateStart: "05/29/2018"
dateEnd: "05/29/2018"
---

The infamous Surgical Summer Volume 1.

<!-- Placeholder for the YouTube video with a play button overlay -->
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <a href="#" onclick="loadVideo('w4XH3LYleDA', this); return false;" style="display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; background-image: url('https://img.youtube.com/vi/w4XH3LYleDA/hqdefault.jpg'); background-position: center; background-size: cover;">
        <img src="https://example.com/play-button.png" style="width: 68px; height: 48px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); cursor: pointer;" alt="Play Video">
    </a>
</div>

<script>
function loadVideo(id, element) {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&controls=1';
    iframe.width = '560';
    iframe.height = '315';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';

    element.parentNode.replaceChild(iframe, element);
}
</script>

[The Story of Adidon lyrics via Genius](https://genius.com/Pusha-t-the-story-of-adidon-lyrics)
