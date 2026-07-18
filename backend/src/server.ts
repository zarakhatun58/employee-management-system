import { createApp } from "./app";
import { connectDB } from "./config/database";
import { config } from "./config/env";

async function bootstrap() {
  try {
    await connectDB();
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`✓ API server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
