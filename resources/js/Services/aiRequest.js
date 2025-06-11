import { Groq } from 'groq-sdk';

async function aiRequest(prompt, sysPrompt) {
    const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": sysPrompt || `You are a pure JSON generator. Follow these rules strictly:
                1. Output raw JSON only
                2. No markdown, no code blocks, no backticks
                3. No explanatory text before or after JSON
                4. No formatting symbols like \`\`\` or \`
                5. Response must be valid JSON that passes JSON.parse()
                {
                    "migrations": {
                        "users": {
                        "id": "bigIncrements",
                        "name": "string",
                        "email": "string|unique",
                        "password": "string",
                        "role": "string|default:customer",
                        "address": "string|nullable",
                        "phone_number": "string|nullable",
                        "public_info": "json|nullable",
                        "email_verified_at": "timestamp|nullable",
                        "remember_token": "string|nullable",
                        "timestamps": true
                        },
                        "categories": {
                        "id": "bigIncrements",
                        "name": "string",
                        "slug": "string|unique",
                        "description": "text|nullable",
                        "image": "string|nullable",
                        "parent_id": "foreignId|nullable",
                        "timestamps": true
                        },
                        "products": {
                        "id": "bigIncrements",
                        "category_id": "foreignId",
                        "name": "string",
                        "slug": "string|unique",
                        "description": "text",
                        "price": "decimal:8,2",
                        "stock": "integer",
                        "images": "json",
                        "status": "string|default:active",
                        "timestamps": true,
                        "foreign_keys": {
                            "category_id": {
                            "references": "id",
                            "on": "categories",
                            "onDelete": "cascade"
                            }
                        }
                        },
                        "orders": {
                        "id": "bigIncrements",
                        "user_id": "foreignId",
                        "status": "string|default:pending",
                        "total_amount": "decimal:10,2",
                        "shipping_address": "text",
                        "billing_address": "text",
                        "payment_status": "string|default:unpaid",
                        "payment_method": "string",
                        "tracking_number": "string|nullable",
                        "notes": "text|nullable",
                        "timestamps": true,
                        "foreign_keys": {
                            "user_id": {
                            "references": "id",
                            "on": "users",
                            "onDelete": "cascade"
                            }
                        }
                        },
                        "order_items": {
                        "id": "bigIncrements",
                        "order_id": "foreignId",
                        "product_id": "foreignId",
                        "quantity": "integer",
                        "price": "decimal:8,2",
                        "timestamps": true,
                        "foreign_keys": {
                            "order_id": {
                            "references": "id",
                            "on": "orders",
                            "onDelete": "cascade"
                            },
                            "product_id": {
                            "references": "id",
                            "on": "products",
                            "onDelete": "cascade"
                            }
                        }
                        }
                    }
                }`
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "temperature": 1,
        // "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "stop": null
    });

    return chatCompletion.choices[0].message.content;
}

export default aiRequest;