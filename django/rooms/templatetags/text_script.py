from django.template.defaulttags import register
from django.utils.html import format_html
from django.utils.safestring import mark_safe


@register.filter
def text_script(value, element_id):
    return format_html(
        '<script id="{}" type="text">{}</script>', element_id, mark_safe(value),
    )
