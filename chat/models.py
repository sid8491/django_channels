from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
    author = models.ForeignKey(
        User,
        related_name='author_messaged',
        on_delete=models.CASCADE
    )
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.username


    def get_history():
        messages = Message.objects.order_by('-created_on').all()[:10]
        return messages