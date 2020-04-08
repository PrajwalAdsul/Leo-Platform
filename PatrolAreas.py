#!/usr/bin/python

from math import sin, cos
import math
import datetime
import matplotlib.pyplot as plt
from opencage.geocoder import OpenCageGeocode, RateLimitExceededError
key = ''
geocoder = OpenCageGeocode(key)

JUMP_LOCATIONS = 20000.0

crimesType = []
latitudes = []
longitudes = []
dates = []
each_slot_tot_crime = [[],[],[],[]] #0 Total crime 1Location Slot 2 Date 3 weightage of time
list_crimes = []
file = open("dataset.csv", "r")
for line in file:
	line = line.split(",")
	crimeType = line[5]
	latitude, longitude = line[19], line[20]
	date = line[2].split(" ")[0]
	if "-" in date:
		date = date.split("-")
	else:
		date = date.split("/")	#time	this is the real time
	date = datetime.datetime(int(date[2]), int(date[0]), int(date[1]))
	crimesType.append(crimeType)
	latitudes.append(latitude)
	longitudes.append(longitude)
	dates.append(date)
	if crimeType not in list_crimes:
		list_crimes.append(crimeType)

quad = []
tab = []
times=1
c = []
x = []
y = []
D = []
minD = 9999999
maxD = 0
R = 6317000.00 #radius of earth
for lat, longi in zip(latitudes, longitudes):
	a = R * cos(float(lat)) * sin(float(lat))
	b = R * cos(float(lat)) * sin(float(longi))
	x.append(a)
	y.append(b)
	d = dis1=((a)**2 + (b)**2)**0.5
	D.append(d)
	if minD > d:
		minD = d
	if maxD < d:
		maxD = d

categories = int(math.ceil((maxD - minD) / JUMP_LOCATIONS))
corner_location = []
corner_location.append(minD)

for i in range(categories):
	quad.append([])
	tab.append([])
	corner_location.append(corner_location[i] + JUMP_LOCATIONS)

for i in range(len(D)):
	location = D[i]
	originalLatLongi = [latitudes[i], longitudes[i]]
	crimeType = crimesType[i]
	date = dates[i]
	for j in range(categories):
		if corner_location[j]<=location and corner_location[j+1]>location:
			quad[j].append([crimeType, location, originalLatLongi, date])
			break
for i in range(categories):
	arr_crime = [0] * len(list_crimes)
	if len(quad[i]):		
		location_slot = '' + str(quad[i][0][2]) + ' to ' + str(quad[i][-1][2])
		for j in range(len(quad[i])):
			crimeType = quad[i][j][0]
			arr_crime[list_crimes.index(crimeType)] += 1

		total_crimes = sum(arr_crime)
		#print ('\n\nFor Location slot { ' + location_slot + ' } Occurrence of Crime types are:  ')

		try:
			r = geocoder.reverse_geocode(quad[i][0][2][0], quad[i][0][2][1])
			if r and len(r):
				print(r[0]['formatted'], end = " to ")
		except RateLimitExceededError as ex:
			print(ex)
		try:
			r = geocoder.reverse_geocode(quad[i][-1][2][0], quad[i][-1][2][1])
			if r and len(r):
				print(r[0]['formatted'], end = ":\n")
		except RateLimitExceededError as ex:
			print(ex)



		print (''.center(100, '*'))
		for crimeName, num in zip(list_crimes, arr_crime):
			print(((' '+crimeName).ljust(50)+str(num)).rjust(50))

		most = max(arr_crime)
		most_crime = list_crimes[arr_crime.index(most)]
		explode = (0,)*len(arr_crime)
		explode = list(explode)
		explode[arr_crime.index(most)] = 0.1
		explode = tuple(explode)
		fig, ax = plt.subplots()
		ax.pie(arr_crime, explode = explode, labels = list_crimes, autopct = "%1.1f%%", shadow = True, startangle = 90)
		ax.axis('equal')
		plt.show()


		print ('\n=> Total Crimes occured and reported in above location slot is : ' + str(total_crimes) + ' reports.')
		print ('\n=> Also the most occured crime in above location slot is : ' + most_crime + ' - ' +str(most) + ' times.\n')
		
		tab[i].extend(arr_crime)
		each_slot_tot_crime[0].append(total_crimes)
		each_slot_tot_crime[1].append(location_slot)
		each_slot_tot_crime[2].append(quad[i][j][3])
	else:
		tab[i].extend(arr_crime)

print ('\n'+''.center(100, '*'))

for crimeName in list_crimes:
	print((crimeName).rjust(25), end = "")
print()
for i in range(categories):
	print ("Slot "+str(i+1), end = "")
	for j in range(len(list_crimes)):
		if j:
			print(str(tab[i][j]).rjust(25), end = "")
		else:
			print(str(tab[i][j]).rjust(18), end = "")
	print()


dates = list(set(dates))
dates.sort()

for crime, date in zip(each_slot_tot_crime[0], each_slot_tot_crime[2]):
	each_slot_tot_crime[3].append(dates.index(date) * crime)

each_slot_tot_crime = list(zip(*each_slot_tot_crime))
each_slot_tot_crime.sort(reverse = True, key = lambda x:x[3])
each_slot_tot_crime = list(zip(*each_slot_tot_crime))


print('\nProne areas:')
for i in range(10):
	#print(each_slot_tot_crime[1][i], end = " ")
	raw_data = each_slot_tot_crime[1][i].split("'")
	try:
		r = geocoder.reverse_geocode(raw_data[1], raw_data[3])
		if r and len(r):
			print(r[0]['formatted'], end = " to ")
	except RateLimitExceededError as ex:
		print(ex)
	try:
		r = geocoder.reverse_geocode(raw_data[5], raw_data[7])
		if r and len(r):
			print(r[0]['formatted'])
	except RateLimitExceededError as ex:
		print(ex)