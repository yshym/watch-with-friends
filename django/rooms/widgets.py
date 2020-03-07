from django.forms.widgets import FileInput


class CustomFileUpload(FileInput):
    template_name = 'widgets/custom_file_upload.djhtml'
