from django.contrib import admin

from .models import (
    Room,
    Message,
)


class MessageAdmin(admin.ModelAdmin):
    list_display = ("sliced_content", "author", "room", "timestamp")
    list_filter = (
        "timestamp",
        "author",
        "room",
    )
    search_fields = (
        "content",
        "author",
    )

    # pylint: disable=no-self-use
    def sliced_content(self, obj):
        sliced_content = (
            f"{obj.content[:60]}..." if len(obj.content) > 40 else obj.content
        )
        return sliced_content


admin.site.register(Message, MessageAdmin)


class MessagesInline(admin.TabularInline):
    model = Message
    extra = 1


class RoomAdmin(admin.ModelAdmin):
    list_display = ("name", "author", "timestamp")
    readonly_fields = ("id",)
    list_filter = ("timestamp", "author")
    search_fields = ("name", "author")

    inlines = (MessagesInline,)


admin.site.register(Room, RoomAdmin)
