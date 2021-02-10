from django.template.defaulttags import register

import re


@register.filter
def youtube_video_id(link):
    youtube_link_re = r"https:\/\/www\.youtube\.com\/watch\?v=(.+)"
    return re.search(youtube_link_re, link).group(1)
