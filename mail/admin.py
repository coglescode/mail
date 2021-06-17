from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Email, User
# Register your models here.

class EmailAdmin(admin.ModelAdmin):
  list_display = ('id', 'user', 'sender', 'subject', 'body', 'read', 'archived' )
  readonly_fields = ('recipients',)

admin.site.register(User, UserAdmin)
admin.site.register(Email, EmailAdmin)
