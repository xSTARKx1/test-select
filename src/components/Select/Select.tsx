import { useEffect, useRef, useState } from 'react'
import {
	FixedSizeList as List,
	type ListChildComponentProps,
} from 'react-window'
import { clsx } from 'clsx'

import { useDebounce } from '../../hooks/useDebounce.ts'
import icon from '../../assets/react.svg'
import { type IOption } from '../../shared/types/select.types.ts'

import styles from './Select.module.scss'

interface ISelectProps {
	options: IOption[]
}

export const Select = ({ options }: ISelectProps) => {
	const [selectedOption, setSelectedOption] = useState<IOption | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const debouncedSearch = useDebounce(searchQuery, 500)
	const selectRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

	const filteredOptions = options.filter((option) =>
		option.text.toLowerCase().includes(debouncedSearch.toLowerCase())
	)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setSearchQuery('')
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [selectRef])

	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			searchInputRef.current.focus()
		}
	}, [isOpen])

	const handleSelect = (option: IOption) => {
		setSelectedOption(option)
		setIsOpen(false)
	}

	const renderRow = ({ index, style }: ListChildComponentProps) => (
		<div
			key={index}
			style={style}
			className={styles.listItem}
			onClick={() => handleSelect(filteredOptions[index])}
		>
			<img src={icon} alt="" />
			{filteredOptions[index].text}
		</div>
	)

	return (
		<div className={styles.wrapper} ref={selectRef}>
			<label htmlFor="">
				<div onClick={() => setIsOpen(!isOpen)} className={styles.input}>
					{selectedOption ? selectedOption.text : 'Select an option'}
				</div>
			</label>
			{isOpen && (
				<div className={clsx(styles.dropdown)}>
					<input
						ref={searchInputRef}
						type="text"
						value={searchQuery}
						className={styles.searchInput}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search..."
					/>
					{filteredOptions.length > 0 ? (
						<List
							height={200}
							itemCount={filteredOptions.length}
							itemSize={35}
							width={'100%'}
						>
							{renderRow}
						</List>
					) : (
						<div className={styles.errorMessage}>Not found!</div>
					)}
				</div>
			)}
		</div>
	)
}
