FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Compile the main app
RUN deno cache --allow-import main.ts

RUN deno compile --include static --include _fresh --include deno.json -A --unstable-kv main.ts

EXPOSE 8000

# Run the app
CMD ["./ledger"]
