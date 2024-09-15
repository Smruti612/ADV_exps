install.packages("ggplot2")
install.packages("dplyr")
install.packages("sf")          # For mapping
install.packages("leaflet")     # For interactive maps
install.packages("ggmap") 

#now loading all libraries
library(ggplot2)
library(dplyr)

#load data set of crime 
library(readr)
crime_data <- read_csv("D:/All/R/R_programs/crime_dataset_india.csv")
View(crime_data)

colnames(crime_data)

#BAR plot
ggplot(crime_data, aes(x = `Crime Description`)) +
  geom_bar(fill = "gold") +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  labs(title = "Crime Description Distribution", x = "Crime Type", y = "Count")

#PIE CHart
# Pie chart: Weapon usage in crimes
weapon_data <- table(crime_data$`Weapon Used`)
pie(weapon_data, labels = names(weapon_data), main = "Proportion of Crimes by Weapon Used")

#Histogram
ggplot(crime_data, aes(x = `Victim Age`)) + 
  geom_histogram(binwidth = 5, fill = "green", color = "black") + 
  labs(title = "Distribution of Victim Ages", x = "Victim Age", y = "Count") +
  theme_minimal()

#Timeline Chart
library(lubridate) #this library helps in date manipulation
crime_data$`Date Reported` <- dmy_hm(crime_data$`Date Reported`)  #here we have converted Date Reported Column in standard Format

ggplot(crime_data, aes(x = `Date Reported`)) + 
geom_line(stat = "count", color = "orange") + 
  labs(title = "Crimes Over Time", x = "Date Reported", y = "Number of Crimes") +
  theme_minimal()

#Scatter Plot
crime_data$`Victim Gender` <- factor(crime_data$`Victim Gender`)
crime_summary <- crime_data %>%
  group_by(`Crime Description`, `Victim Gender`) %>%
  summarise(Victim_Count = n(), .groups = 'drop')

# Scatter plot: Number of victims for each crime type by gender
ggplot(crime_summary, aes(x = `Crime Description`, y = Victim_Count, color = `Victim Gender`, size = Victim_Count)) + 
  geom_point(alpha = 0.7) + 
  labs(title = "Number of Victims by Crime Type and Gender", x = "Crime Description", y = "Number of Victims") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  scale_size_continuous(range = c(2, 10))

#BUBBLE CHART
bubble_data <- crime_data %>%
  group_by(City, `Crime Domain`) %>%
  summarise(Count = n(), .groups = 'drop')

# Create the bubble chart
ggplot(bubble_data, aes(x = City, y = `Crime Domain`, size = Count, color = Count)) + 
  geom_point(alpha = 0.7) + 
  labs(title = "Bubble Chart of City and Crime Domain", x = "City", y = "Crime Domain") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +  # Rotate x-axis labels for readability
  scale_size_continuous(range = c(2, 20))  # Adjust range for bubble sizes