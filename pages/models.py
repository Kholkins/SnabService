# -*- coding: utf-8

from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Vacancie(models.Model):
  position = models.CharField(max_length = 50)
  schedule = models.CharField(max_length = 50)
  responsibility = models.TextField()
  work_place = models.CharField(max_length = 50)
  salary = models.CharField(max_length = 50)

  def __unicode__(self):
    return self.position

class Product(models.Model):
  title = models.CharField(max_length = 50, blank = True, default = '')
  category = models.CharField(max_length = 15, blank = True, default = '')
  shape = models.CharField(max_length = 30, blank = True, default = '')
  diameter = models.FloatField(blank = True, default = 0)
  length = models.FloatField(blank = True, default = 0)
  price = models.IntegerField(blank = True, default = 0)

  def __unicode__(self):
    title = unicode(self.pk) + ': '
    if self.title:
      title += self.title + ' '
    if self.category:
      title += self.category + ' '
    if self.shape:
      title += self.shape + ' '
    if self.diameter:
      title += u'Диаметр - ' + unicode(self.diameter) + u'мм '
    if self.length:
      title += u'Длина - ' + unicode(self.length) + u'м '
    if self.price:
      title += unicode(self.price) + u'руб.'
    return title

class PurchasesPrice(models.Model):
  category = models.CharField(max_length = 30, default = '')
  price = models.IntegerField(default = 0)

  def __unicode__(self):
    return str(self.category)
