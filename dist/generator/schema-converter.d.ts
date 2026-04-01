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
import { z, ZodTypeAny } from "zod";
/** Minimal JSON Schema type used in the OpenAPI spec */
export interface JSONSchemaProperty {
    type?: string;
    enum?: (string | number | boolean)[];
    items?: JSONSchemaProperty;
    properties?: Record<string, JSONSchemaProperty>;
    required?: string[];
    additionalProperties?: JSONSchemaProperty | boolean;
    propertyNames?: JSONSchemaProperty;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    description?: string;
    default?: unknown;
    anyOf?: JSONSchemaProperty[];
    nullable?: boolean;
}
/** OpenAPI parameter object (query/path params for GET requests) */
export interface OpenAPIParameter {
    name: string;
    in: string;
    required?: boolean;
    schema?: JSONSchemaProperty;
    description?: string;
}
/** OpenAPI operation details */
export interface OpenAPIOperation {
    tags?: string[];
    description?: string;
    summary?: string;
    parameters?: OpenAPIParameter[];
    requestBody?: {
        content?: {
            "application/json"?: {
                schema?: JSONSchemaProperty;
            };
        };
    };
    responses?: Record<string, unknown>;
}
/**
 * Build the Zod input schema for an OpenAPI operation.
 * Returns null if the endpoint has no parameters.
 */
export declare function buildInputSchema(method: string, operation: OpenAPIOperation): z.ZodObject<Record<string, ZodTypeAny>> | null;
/**
 * Build a human-readable description for a tool from its OpenAPI operation.
 */
export declare function buildDescription(path: string, method: string, operation: OpenAPIOperation): string;
//# sourceMappingURL=schema-converter.d.ts.map