FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

ENV JWT_SECRET=temp
ENV RESEND_API_KEY=re_123545
ENV MONGODB_URI=mongodb://user:password@localhost:27017
ENV DB_NAME=ledger
ENV AWS_ACCESS_KEY_ID=temp
ENV SECRET_ACCESS_KEY=temp

# Compile the main app
RUN deno cache --allow-import main.ts

RUN deno task build

RUN deno compile --include static/ --include _fresh/ --include deno.json -A --unstable-kv main.ts

EXPOSE 8000

# Run the app
CMD ["./ledger"]
