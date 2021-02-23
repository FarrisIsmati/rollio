FROM public.ecr.aws/lambda/python:3.7

# Copy function code
COPY . .

# Install python requirements
RUN pip install -r requirements.txt

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "main.handler" ]