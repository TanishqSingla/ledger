FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Compile the main app
RUN deno cache --allow-import main.ts

RUN deno task build

COPY ./_fresh /app/

# Run the app
CMD ["deno", "task", "preview"]
