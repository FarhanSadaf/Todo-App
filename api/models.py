from django.db import models

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    datetime_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
