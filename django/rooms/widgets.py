from django.forms.widgets import Widget, FileInput, SelectMultiple


class CustomFileUpload(FileInput):
    template_name = 'widgets/custom_file_upload.djhtml'
