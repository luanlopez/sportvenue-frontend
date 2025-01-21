"use client";

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  placeholder?: string;
}

export function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  error,
  placeholder = "Selecione uma opção" 
}: SelectProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-1">
          {label}
        </label>
      )}
      
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className={`
            relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-4 pr-10 text-left
            border transition-colors focus:outline-none focus:ring-2
            ${error 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500'
            }
          `}>
            <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg
              bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 
                    ${active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'}`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {error && (
        <p className="mt-1 text-sm text-error-500">
          {error}
        </p>
      )}
    </div>
  );
} 