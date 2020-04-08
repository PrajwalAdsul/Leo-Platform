#!/usr/bin/python

#  Write a MapReduce program which will display the number of hits for each different file on the Web site.


import datetime
import math
import matplotlib.pyplot as plt

####format = mm-dd-yyyy
minDate = datetime.datetime(2020, 12, 31)
maxDate = datetime.datetime(1990, 1,1)
arr = []
crimesType = []
latitudes = []
longitudes = []
dates = []
labels = 'Theft', 'Criminals', 'Burglary', 'Assault', 'Narcotics'

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
	if maxDate < date:
		maxDate = date
	if minDate > date:
		minDate = date
	crimesType.append(crimeType)
	latitudes.append(latitude)
	longitudes.append(longitude)
	dates.append(date)

#  Write a MapReduce program which will display the number of hits for each different file on the Web site.

#quad1=[],quad2=[],quad3=[],quad4=[],quad5=[],quad6=[],quad7=[],quad8=[]
quad = []
tab = []
corner_dates = []
corner_dates.append(minDate)
categories = int(math.ceil(((maxDate - minDate).days) / 15.0))
index=-1
count=0

for i in range(categories):
	quad.append([])
	tab.append([])
	corner_dates.append(corner_dates[i] + datetime.timedelta(days=15))

for i in range(len(dates)):
	date = dates[i]
	crimeType = crimesType[i]
	for j in range(categories):
		if corner_dates[j]<=date and corner_dates[j+1]>date:
			quad[j].append([crimeType, date])
			break

for i in range(categories):
	#theft_c=0,murder_c=0,robbery_c=0,rape_c=0,drugs_c=0
	theft_c = 0
	criminal_c=0
	burglary_c=0
	assault_c=0
	narcotics_c=0
	time_slot = '' + str(corner_dates[i]) + ' to ' + str(corner_dates[i+1])

	for j in range(len(quad[i])):
		crimeType = quad[i][j][0]
		if crimeType == 'THEFT':
			theft_c = theft_c + 1
		elif crimeType=='CRIMINAL DAMAGE':
			criminal_c = criminal_c + 1
		elif crimeType=='BURGLARY':
			burglary_c = burglary_c + 1
		elif crimeType=='ASSAULT':
			assault_c = assault_c + 1
		elif crimeType=='NARCOTICS':
			narcotics_c = narcotics_c + 1

	total_crimes = theft_c + criminal_c + burglary_c + assault_c + narcotics_c
	print ('\n\nFor Time slot { ' + time_slot + ' } Occurrence of Crime types are:  ')
	print ('-------------------------------------------------------------')
	print ('\t\tTHEFT\t\t\t: '+str(theft_c))
	print ('\t\tCRIMINAL DAMAGE\t\t: '+str(criminal_c))
	print ('\t\tBURGLARY\t\t: '+str(burglary_c))
	print ('\t\tASSAULT\t\t\t: '+str(assault_c))
	print ('\t\tNARCOTICS\t\t: '+str(narcotics_c))
	
	most = max(int(theft_c),int(criminal_c), int(burglary_c), int(assault_c), int(narcotics_c))
	sizes = [theft_c, criminal_c, burglary_c, assault_c, narcotics_c]
	explode = (0,0,0,0,0)
	explode = list(explode)
	if most==theft_c:
		most_crime='THEFT'
		explode[0] = 0.1
	elif most==criminal_c:
		most_crime='CRIMINAL DAMAGE'
		explode[1] = 0.1
	elif most==burglary_c:
		most_crime='BURGLARY'
		explode[2] = 0.1
	elif most==assault_c:
		most_crime='ASSAULT'
		explode[3] = 0.1
	elif most==narcotics_c:
		most_crime='NARCOTICS'
		explode[4] = 0.1
	explode = tuple(explode)
	fig, ax = plt.subplots()
	ax.pie(sizes, explode = explode, labels = labels, autopct = "%1.1f%%", shadow = True, startangle = 90)
	ax.axis('equal')
	plt.show()

	print ('\n\t\t=> Total Crimes occured and reported in above time slot is : ' + str(total_crimes) + ' reports.')
	print ('\n\t\t=> Also the most occured crime in above time slot is : ' + most_crime + ' - ' +str(most) + ' times.')
	
	#val = [i,theft_c,criminal_c,burglary_c,assault_c,narcotics_c]
	#for j in range(0,5):
	#add=str(theft_c)+","+str(criminal_c)+","+str(burglary_c)+","+str(assault_c)+","+str(narcotics_c)	
	tab[i].append(theft_c)
	tab[i].append(criminal_c)
	tab[i].append(burglary_c)
	tab[i].append(assault_c)
	tab[i].append(narcotics_c)
	
	# Now on the basis of counts of the crime type we will proceed

print ('\n\n**************************************************************************************************')
print ('\n\t\t\tTHEFT\t\tCRIMINAL\tBURGLARY\tASSAULT\t\tNARCOTICS')
for i in range(categories):
	#for j in range(0,5):
	print ("\nSlot "+str(i+1)+"\t\t\t"+str(tab[i][0])+"\t\t"+str(tab[i][1])+"\t\t"+str(tab[i][2])+"\t\t"+str(tab[i][3])+"\t\t"+str(tab[i][4]))

print ('\n\t* Total number of Tuples analysed are : ' + str(count))
print ('\n**************************************************************************************************\n\n')