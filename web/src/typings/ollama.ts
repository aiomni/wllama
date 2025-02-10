export type OllamaVersionResponse = {
	version: string;
};

export type OllamaMessage = {
	role: string;
	content: string;
	images?: string[];
	tool_calls?: OllamaToolCall[];
};

export type OllamaChatRequest = {
	model: string;
	messages: OllamaMessage[];

	stream?: boolean;
	quantize?: string;

	from?: string;
	files?: Record<string, string>;
	adapters?: Record<string, string>;
	template?: string;
	license?: any;

	system?: string;
	parameters?: Record<string, any>;
};

export type OllamaChatResponse = {
	model: string;
	created_at: string;
	message: OllamaMessage;

	done: boolean;
	done_reason?: string;
};

export type OllamaToolCall = {
	function: OllamaToolCallFunction;
};

export type OllamaToolCallFunction = {
	index?: number;
	name: string;
	arguments: Record<string, any>;
};

export type OllamaModel = {
	name: string;
	model: string;
	modified_at: string;
	size: number;
	digest: string;
	details?: OllamaModelDetails;
}

export type OllamaModelDetails = {
	parent_model: string;
	format: string;
	family: string;
	families: string[];
	parameter_size: string;
	quantization_level: string;
}
