import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Typography} from './Typography';
import {colors} from '../../theme/colors';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
  disabled = false,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  const renderOption = ({item}: {item: DropdownOption}) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleSelect(item.value)}>
      <Typography variant="body" color={colors.text}>
        {item.label}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Typography variant="body" style={styles.label} color={colors.text}>
        {label}
      </Typography>

      <TouchableOpacity
        style={[
          styles.selector,
          disabled && styles.selectorDisabled,
          error ? styles.selectorError : null,
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}>
        <Typography
          variant="body"
          color={selectedOption ? colors.text : colors.textMuted}
          style={styles.selectorText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Typography>
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.arrow}>
          {isVisible ? '▲' : '▼'}
        </Typography>
      </TouchableOpacity>

      {error && (
        <Typography
          variant="caption"
          color={colors.error}
          style={styles.errorText}>
          {error}
        </Typography>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsVisible(false)}>
          <View style={styles.modal}>
            <Typography
              variant="h3"
              style={styles.modalTitle}
              color={colors.text}>
              {label}
            </Typography>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={item => item.value}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  selectorDisabled: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  selectorError: {
    borderColor: colors.error,
  },
  selectorText: {
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '70%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
    color: colors.titlePrimary,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
