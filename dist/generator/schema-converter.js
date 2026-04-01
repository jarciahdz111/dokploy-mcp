/**
 * Converts JSON Schema (from OpenAPI spec) to Zod schemas at runtime.
 *
 * Handles all types found in the Dokploy OpenAPI spec:
 * - string (with optional enum, minLength, maxLength)
 * - number (with optional minimum, maximum)
 * - boolean
 * - array (of strings, objects, or mixed)
 * - object (nested, or with additionalProperties as record)
 * - anyOf/nullable patterns
 */
import { z } from "zod";
/**
 * Convert a single JSON Schema property to a Zod type.
 */
function convertProperty(prop, isRequired) {
    let zodType;
    // Handle anyOf (usually nullable pattern: [{ type: X }, { type: "null" }])
    if (prop.anyOf && prop.anyOf.length > 0) {
        const nonNullTypes = prop.anyOf.filter((t) => t.type !== "null");
        if (nonNullTypes.length === 1) {
            // Nullable type: pick the non-null variant and make it nullable
            zodType = convertProperty(nonNullTypes[0], true).nullable();
        }
        else if (nonNullTypes.length > 0) {
            // Multiple types — use z.any() as fallback
            zodType = z.any();
        }
        else {
            zodType = z.any().nullable();
        }
        if (!isRequired) {
            zodType = zodType.optional();
        }
        return zodType;
    }
    // Handle enum
    if (prop.enum && prop.enum.length > 0) {
        const values = prop.enum.map(String);
        if (values.length === 1) {
            zodType = z.literal(values[0]);
        }
        else {
            zodType = z.enum(values);
        }
        if (!isRequired) {
            zodType = zodType.optional();
        }
        return zodType;
    }
    // Handle by type
    switch (prop.type) {
        case "string": {
            let strType = z.string();
            if (prop.minLength !== undefined) {
                strType = strType.min(prop.minLength);
            }
            if (prop.maxLength !== undefined) {
                strType = strType.max(prop.maxLength);
            }
            zodType = strType;
            break;
        }
        case "number":
        case "integer": {
            let numType = z.number();
            if (prop.type === "integer") {
                numType = numType.int();
            }
            if (prop.minimum !== undefined) {
                numType = numType.min(prop.minimum);
            }
            if (prop.maximum !== undefined) {
                numType = numType.max(prop.maximum);
            }
            zodType = numType;
            break;
        }
        case "boolean":
            zodType = z.boolean();
            break;
        case "array": {
            if (prop.items) {
                const itemType = convertProperty(prop.items, true);
                zodType = z.array(itemType);
            }
            else {
                zodType = z.array(z.any());
            }
            break;
        }
        case "object": {
            if (prop.additionalProperties &&
                typeof prop.additionalProperties === "object") {
                // Record type: { [key: string]: valueType }
                const valueType = convertProperty(prop.additionalProperties, true);
                zodType = z.record(z.string(), valueType);
            }
            else if (prop.properties) {
                // Structured object with known properties
                zodType = convertObjectSchema(prop.properties, prop.required ?? []);
            }
            else {
                // Generic object
                zodType = z.record(z.string(), z.any());
            }
            break;
        }
        default:
            zodType = z.any();
            break;
    }
    if (!isRequired) {
        zodType = zodType.optional();
    }
    return zodType;
}
/**
 * Convert an object with properties to a Zod object schema.
 */
function convertObjectSchema(properties, required) {
    const shape = {};
    for (const [name, prop] of Object.entries(properties)) {
        const isRequired = required.includes(name);
        const zodProp = convertProperty(prop, isRequired);
        // Add description if available
        if (prop.description) {
            shape[name] = zodProp.describe(prop.description);
        }
        else {
            shape[name] = zodProp;
        }
    }
    return z.object(shape);
}
/**
 * Build a Zod input schema for a GET endpoint (from query parameters).
 */
function buildGetInputSchema(parameters) {
    if (!parameters || parameters.length === 0) {
        return null;
    }
    const shape = {};
    for (const param of parameters) {
        if (param.in !== "query")
            continue;
        const schema = param.schema ?? { type: "string" };
        const isRequired = param.required === true;
        let zodProp = convertProperty(schema, isRequired);
        if (param.description) {
            zodProp = zodProp.describe(param.description);
        }
        shape[param.name] = zodProp;
    }
    if (Object.keys(shape).length === 0) {
        return null;
    }
    return z.object(shape);
}
/**
 * Build a Zod input schema for a POST endpoint (from request body).
 */
function buildPostInputSchema(operation) {
    const bodySchema = operation.requestBody?.content?.["application/json"]?.schema;
    if (!bodySchema || !bodySchema.properties) {
        return null;
    }
    return convertObjectSchema(bodySchema.properties, bodySchema.required ?? []);
}
/**
 * Build the Zod input schema for an OpenAPI operation.
 * Returns null if the endpoint has no parameters.
 */
export function buildInputSchema(method, operation) {
    if (method === "get") {
        return buildGetInputSchema(operation.parameters ?? []);
    }
    else {
        return buildPostInputSchema(operation);
    }
}
/**
 * Build a human-readable description for a tool from its OpenAPI operation.
 */
export function buildDescription(path, method, operation) {
    const endpoint = path.replace(/^\//, "");
    const tag = operation.tags?.[0] ?? "unknown";
    const httpMethod = method.toUpperCase();
    const lines = [];
    lines.push(`[${tag}] ${endpoint} (${httpMethod})`);
    if (operation.description) {
        lines.push("");
        lines.push(operation.description);
    }
    // Document parameters for GET
    if (method === "get" && operation.parameters && operation.parameters.length > 0) {
        lines.push("");
        lines.push("Parameters:");
        for (const param of operation.parameters) {
            const schema = param.schema ?? {};
            const typeStr = schema.enum
                ? `enum: ${schema.enum.join(", ")}`
                : schema.type ?? "string";
            const reqStr = param.required ? "required" : "optional";
            const descStr = param.description ? ` — ${param.description}` : "";
            lines.push(`  - ${param.name} (${typeStr}, ${reqStr})${descStr}`);
        }
    }
    // Document request body for POST
    if (method === "post") {
        const bodySchema = operation.requestBody?.content?.["application/json"]?.schema;
        if (bodySchema?.properties) {
            const required = bodySchema.required ?? [];
            lines.push("");
            lines.push("Parameters:");
            for (const [name, prop] of Object.entries(bodySchema.properties)) {
                const typeStr = prop.enum
                    ? `enum: ${prop.enum.join(", ")}`
                    : prop.type ?? "any";
                const reqStr = required.includes(name) ? "required" : "optional";
                const descStr = prop.description ? ` — ${prop.description}` : "";
                lines.push(`  - ${name} (${typeStr}, ${reqStr})${descStr}`);
            }
        }
    }
    return lines.join("\n");
}
//# sourceMappingURL=schema-converter.js.map