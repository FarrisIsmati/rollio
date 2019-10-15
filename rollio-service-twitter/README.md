# Rollio-Service-Twitter
Requests list of vendors from the vendor service to get an array of twitter IDs to listen on.
When a new tweet comes in the service parses it and determines whether or not an eligble location has been found. 
The resulting data gets pushed back to the Vendor Service via RabbitMQ where the Vendor Service is constantly listening for new messages.
