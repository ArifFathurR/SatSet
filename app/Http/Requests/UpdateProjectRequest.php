<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_private' => ['nullable', 'boolean'],
            'custom_columns' => ['nullable', 'array'],
            'custom_columns.*.id' => ['required_with:custom_columns', 'string'],
            'custom_columns.*.name' => ['required_with:custom_columns', 'string'],
            'custom_columns.*.color' => ['required_with:custom_columns', 'string'],
        ];
    }
}
