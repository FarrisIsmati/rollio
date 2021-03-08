FROM public.ecr.aws/lambda/python:3.6

# Copy function code
COPY . .

# Upgrade PIP
RUN pip install --upgrade pip
# Install python requirements
RUN pip install -r requirements.txt

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "main.handler" ]