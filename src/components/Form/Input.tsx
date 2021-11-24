import { FormLabel, FormControl, Input as ChakraInput, InputProps as ChakraInputProps, FormErrorMessage} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import { ChangeEventHandler } from 'react'


interface InputProps extends ChakraInputProps {
    name: string;
    label?: string;
    error?: FieldError;
} 



const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ( {name, label,error = null, type, ...rest}, ref) => {
    return (
        <FormControl isInvalid={!!error}>
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        {type === "file" ? (<ChakraInput name={name}
              id={name} 
              type={type}
              multiple
              variant="filled"
              accept="image/jpeg, image/png, image/jpg"
              bgColor="gray.900"
              _hover={{bgColor: 'gray.900'}}
              size="lg"
              ref={ref}
              {...rest}
              
            />
            
            ) : (
                <ChakraInput name={name}
                id={name} 
                focusBorderColor="yellow.400"
                bgColor="gray.900"
                variant="filled"
                _hover={{
                    bgColor: 'gray.900'
                }}
                size="lg"
                ref={ref}
                {...rest}
              />
            )}
       

  

        {!!error && (
            <FormErrorMessage>
                {error.message}
            </FormErrorMessage>
        )}
        </FormControl>
        

    )
}

export const Input = forwardRef(InputBase)