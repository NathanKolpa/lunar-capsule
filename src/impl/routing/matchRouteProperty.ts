export interface MatchResult {
    matches: boolean,
    parameters: { [key: string]: string }
}

export function matchRouteProperty(template: string, input: string): MatchResult {
    let isWildcardActive = false;
    let matches = true;
    let currentParam: string | undefined;
    let currentParamValue = '';
    let parameters: { [key: string]: string } = {}

    let templateIndex = 0;
    let inputIndex = 0;
    for (; inputIndex < input.length; inputIndex++) {
        let currentInputChar = input[inputIndex];
        let currentTemplateChar = template[templateIndex];

        if (currentParam !== undefined) {
            if (currentInputChar == currentTemplateChar || inputIndex >= input.length) {
                parameters[currentParam] = currentParamValue;
                currentParam = undefined;
                currentParamValue = '';
                if (templateIndex >= template.length && inputIndex >= input.length) { // the end of the template has been reached and input has still chars to go
                    matches = false;
                    break;
                }
                else {
                    templateIndex++;
                }
            }
            else {
                currentParamValue += currentInputChar;
            }
        }
        else if (!isWildcardActive) {
            if (currentTemplateChar == '*') { //start the wild card pattern
                isWildcardActive = true;

                if (templateIndex >= template.length) { // the template ends with a wildcard so everyting will match afterwards, no futher checking required
                    matches = true;
                    inputIndex = input.length - 1;
                    break;
                }
                else {
                    matches = false;
                    templateIndex++;
                }
            }
            else if (currentTemplateChar == '{') { // start parsing the parameter
                let foundEnd = false;
                currentParam = '';
                templateIndex++;
                currentParamValue = currentInputChar;

                for (; templateIndex <= template.length; templateIndex++) {
                    currentTemplateChar = template[templateIndex];

                    if (currentTemplateChar == '}') {
                        foundEnd = true;
                        break;
                    }

                    currentParam += currentTemplateChar;
                }

                if (!foundEnd) {
                    throw new Error('Unclosed \'}\' in the template');
                }

                templateIndex++;
            }
            else if (currentInputChar != currentTemplateChar) { // the template does not match
                matches = false;
                break;
            }
            else {
                if (templateIndex >= template.length && inputIndex >= input.length) { // the end of the template has been reached and input has still chars to go
                    matches = false;
                    break;
                }
                else {
                    templateIndex++;
                }
            }
        }
        else if (currentInputChar == currentTemplateChar) { // check for the end of the wildCard pattern
            isWildcardActive = false;
            if (templateIndex >= template.length && inputIndex >= input.length) { // the end of the template has been reached and input has still chars to go
                matches = false;
                break;
            }
            else {
                matches = true;
                templateIndex++;
            }
        }
    }

    if (matches) {
        if (template.length - templateIndex != 0 || input.length - inputIndex) {
            matches = false;
        }
    }

    return {
        matches: matches,
        parameters: parameters
    }
}