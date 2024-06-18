import sys
import textwrap
import google.generativeai as genai

# Your Google API key
GOOGLE_API_KEY = 'AIzaSyAQQ1QChnpmrc8Wtaz-wslDNZOZ-pxpViA'

# Function to format text into Markdown
def to_markdown(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

if not GOOGLE_API_KEY:
    raise ValueError("Please set the GOOGLE_API_KEY environment variable")

genai.configure(api_key=GOOGLE_API_KEY)

# Use a specific model to generate content
model = genai.GenerativeModel('gemini-1.5-flash')

# Get the plant name from command line arguments
if len(sys.argv) != 2:
    raise ValueError("Please provide the plant name as an argument")

plant_name = sys.argv[1]
response = model.generate_content(f"Tell only about {plant_name} in short without any marks in separate lines in list form like Name:, Habitat:, Classification:, Morphology:, Life_Cycle:, Climate_Adaptations:, Growth_Strategies:, Rarity:")

# Print the response in markdown format
formatted_response = to_markdown(response.text)
print(formatted_response)
