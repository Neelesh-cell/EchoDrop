# EchoDrop

EchoDrop is a simple, modern feedback widget and admin dashboard.

## Embedding the Widget

To collect feedback from your users, you can embed the widget on any webpage. 

Just include the following `<script>` tag right before the closing `</body>` tag of your website:

```html
<script src="https://[YOUR_DOMAIN]/widget.js" data-color="#6366f1" data-project-id="your-project-name"></script>
```

### Configuration Options
You can customize the widget by modifying the attributes on the `<script>` tag:

- `data-color` (Optional): The primary hex color for the widget's buttons and accents (e.g., `#6366f1`). Defaults to indigo.
- `data-project-id` (Optional): An identifier string to categorize your feedback in the dashboard.

## Deployment

This application is ready to be deployed on Vercel. 

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Set the following Environment Variables in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

The included `vercel.json` file is configured to ensure proper CORS headers so external sites can submit feedback without issues.
