from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0002_contentreport"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="courses/"),
        ),
    ]
