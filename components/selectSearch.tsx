"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string | number
  label: string
  [key: string]: any
}

interface ComboboxProps {
  options: ComboboxOption[] | any[]
  valueKey?: string
  labelKey?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  contentClassname?: string
  onSelect?: (value: string | number | (string | number)[], item?: any | any[]) => void
  value?: string | number | (string | number)[]
  defaultValue?: string | number | (string | number)[]
  isLoading?: boolean
  displayLimit?: number
  multiple?: boolean
  maxDisplayedSelectedItems?: number
}

export const SelectSearch = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options = [],
      valueKey = 'value',
      labelKey = 'label',
      placeholder = "Select an option...",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      className,
      onSelect,
      value: controlledValue,
      defaultValue = "",
      isLoading = false,
      displayLimit = 10,
      contentClassname,
      multiple = false,
      maxDisplayedSelectedItems = 3,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [displayCount, setDisplayCount] = React.useState(displayLimit)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const normalizedOptions = React.useMemo(() => {
      return options.map((item: any) => ({
        ...item,
        value: item[valueKey],
        label: item[labelKey],
      }))
    }, [options, valueKey, labelKey])

    const filteredOptions = React.useMemo(() => {
      if (!searchTerm) return normalizedOptions
      return normalizedOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }, [normalizedOptions, searchTerm])

    const displayedOptions = React.useMemo(() => {
      return filteredOptions.slice(0, displayCount)
    }, [filteredOptions, displayCount])

    const currentValues = React.useMemo(() => {
      if (multiple) {
        if (Array.isArray(value)) return value
        return value ? [value] : []
      }
      return value
    }, [value, multiple])

    const selectedOptions = React.useMemo(() => {
      if (multiple) {
        return normalizedOptions.filter(option => 
          (currentValues as (string | number)[]).includes(option.value)
        )
      }
      return normalizedOptions.find(option => option.value === currentValues)
    }, [normalizedOptions, currentValues, multiple])

    const handleSelect = (selectedValue: string | number) => {
      if (multiple) {
        const current = Array.isArray(currentValues) ? [...currentValues] : []
        const newValues = current.includes(selectedValue)
          ? current.filter(v => v !== selectedValue)
          : [...current, selectedValue]
        
        if (!isControlled) {
          setInternalValue(newValues)
        }
        
        const selectedItems = normalizedOptions.filter(opt => newValues.includes(opt.value))
        onSelect?.(newValues, selectedItems)
      } else {
        const newValue = selectedValue === currentValues ? "" : selectedValue
        if (!isControlled) {
          setInternalValue(newValue)
        }
        
        const selectedItem = normalizedOptions.find(opt => opt.value === newValue)
        onSelect?.(newValue, selectedItem)
        setOpen(false)
      }
      
      setSearchTerm("") // Reset search on select
      setDisplayCount(displayLimit) // Reset display count
    }

    const removeSelected = (valueToRemove: string | number, e: React.MouseEvent) => {
      console.log("Removing value:", valueToRemove)
      e.stopPropagation()
      if (multiple) {
        const newValues = (currentValues as (string | number)[]).filter(v => v !== valueToRemove)
        if (!isControlled) {
          setInternalValue(newValues)
        }
        
        const selectedItems = normalizedOptions.filter(opt => newValues.includes(opt.value))
        onSelect?.(newValues, selectedItems)
      }
    }

    const clearSelection = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (multiple) {
        if (!isControlled) {
          setInternalValue([])
        }
        onSelect?.([], [])
      } else {
        if (!isControlled) {
          setInternalValue("")
        }
        onSelect?.("", undefined)
      }
    }

    const handleSearchChange = (value: string) => {
      setSearchTerm(value)
      setDisplayCount(displayLimit)  
    }

    const loadMore = () => {
      setDisplayCount(prev => prev + displayLimit)
    }

    const renderTriggerContent = () => {
      if (isLoading) return "Loading..."
      
      if (multiple) {
        const selected = selectedOptions as ComboboxOption[]
        if (selected.length === 0) return placeholder
        
        return (
          <div className="flex gap-1 flex-wrap overflow-hidden">
            {selected.slice(0, maxDisplayedSelectedItems).map(option => (
              <Badge 
                key={option.value} 
                variant="secondary"
                className="flex items-center gap-1 max-w-full rounded-xs"
              >
                <span className="truncate">{option.label}</span>
              </Badge>
            ))}
            {selected.length > maxDisplayedSelectedItems && (
              <Badge variant="secondary" className="px-2">
                +{selected.length - maxDisplayedSelectedItems} more
              </Badge>
            )}
          </div>
        )
      } else {
        const selected = selectedOptions as ComboboxOption | undefined
        return (
          <>
            {selected?.label || placeholder}
            {selected && (
              <X 
                className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer" 
                onClick={clearSelection}
              />
            )}
          </>
        )
      }
    }

    return (
      <Popover open={open} onOpenChange={(open) => {
        setOpen(open)
        if (!open) {
          setSearchTerm("")
          setDisplayCount(displayLimit)
        }
      }}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between min-h-10", className, {
              "h-auto min-h-10": multiple && Array.isArray(currentValues) && currentValues.length > 0
            })}
            disabled={isLoading}
          >
            <span className="truncate flex-1 text-left">
              {renderTriggerContent()}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('p-0', contentClassname)} align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder={searchPlaceholder} 
              className="h-9"
              value={searchTerm}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading data...</CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {displayedOptions.map((option) => {
                      const isSelected = multiple 
                        ? (currentValues as (string | number)[]).includes(option.value)
                        : currentValues === option.value
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value.toString()}
                          onSelect={() => handleSelect(option.value)}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      )
                    })}
                    {filteredOptions.length > displayCount && (
                      <CommandItem 
                        className="text-center text-xs text-muted-foreground justify-center"
                        onSelect={loadMore}
                      >
                        Load more ({filteredOptions.length - displayCount} remaining)
                      </CommandItem>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SelectSearch.displayName = "SelectSearch"