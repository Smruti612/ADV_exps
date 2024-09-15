#now loading all libraries
library(ggplot2)
library(dplyr)

#load data set of housing 
library(readr)
house_data <- read_csv("D:/All/R/R_programs/Housing.csv")
View(house_data)

colnames(house_data)


# Box and Whisker plot of price by furnishingstatus
ggplot(house_data, aes(x = `furnishingstatus`, y = `price`)) +
  geom_boxplot() +
  theme_minimal() +
  labs(title = "Boxplot of Price by Furnishing Status", x = "Furnishing Status", y = "Price")

# Violin plot of price by AC
ggplot(house_data, aes(x = `airconditioning`, y = `price`)) +
  geom_violin(trim = FALSE) +
  theme_minimal() +
  labs(title = "Violin Plot of Price by airconditioning", x = "AC", y = "Price")


# Linear regression: Price vs Area
ggplot(house_data, aes(x = `area`, y = `price`)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE, color = "yellow") +
  theme_minimal() +
  labs(title = "Linear Regression: Price vs Area", x = "Area", y = "Price")

install.packages("plotly")
library(plotly)
plot_ly(house_data, x = ~area, y = ~bedrooms, z = ~price, color = ~furnishingstatus, type = "scatter3d", mode = "markers") %>%
  layout(title = "3D Scatter Plot: Price vs Area vs Bedrooms",
         scene = list(xaxis = list(title = "Area"),
                      yaxis = list(title = "Bedrooms"),
                      zaxis = list(title = "Price")))

# Jitter plot of price vs bedrooms
ggplot(house_data, aes(x = bedrooms, y = price)) +
  geom_jitter(width = 0.2, height = 0) +
  theme_minimal() +
  labs(title = "Jitter Plot: Price vs Bedrooms", x = "Bedrooms", y = "Price")

