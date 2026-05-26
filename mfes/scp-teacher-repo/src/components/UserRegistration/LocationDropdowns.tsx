
import React, { useState, useEffect, useRef } from 'react';
import { Box, Select, MenuItem, InputLabel, Grid, FormControl } from '@mui/material';
import { getFieldOptions } from '../../services/MasterDataService';
import { getCohortData } from '../../services/CohortServices';

interface LocationOption {
  value: number | string;
  label: string;
  [key: string]: any;
}

interface LocationDropdownsProps {
  onLocationChange?: (location: {
    states?: number[];
    districts?: number[];
    blocks?: number[];
    villages?: number[];
  }) => void;
}

type StoredLocationFilters = {
  state?: number | string;
  district?: number | string;
  block?: number | string;
  village?: number | string;
};

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({ onLocationChange }) => {
  const LOCATION_STORAGE_KEY = 'selectedLocationFilters';

  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [blocks, setBlocks] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedState, setSelectedState] = useState<number | string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<number | string>('');
  const [selectedBlock, setSelectedBlock] = useState<number | string>('');
  const [selectedVillage, setSelectedVillage] = useState<number | string>('');

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const [userLocationIds, setUserLocationIds] = useState<{
    stateId: number | null;
    districtId: number | null;
    blockId: number | null;
    villageId: number | null;
  }>({
    stateId: null,
    districtId: null,
    blockId: null,
    villageId: null,
  });

  const storedLocationRef = useRef<StoredLocationFilters>({});
  const defaultsAppliedRef = useRef({
    states: false,
    districts: false,
    blocks: false,
    villages: false,
  });
  const [isStoredLocationLoaded, setIsStoredLocationLoaded] = useState(false);

  const parseCustomFieldSelection = (field: any): number | string | undefined => {
    if (!field?.selectedValues?.length) return undefined;
    const valueItem = field.selectedValues[0];
    if (valueItem?.id !== undefined && valueItem?.id !== null) {
      const parsedId = Number(valueItem.id);
      if (!Number.isNaN(parsedId)) return parsedId;
    }
    if (valueItem?.value !== undefined && valueItem?.value !== null) {
      return valueItem.value;
    }
    return undefined;
  };

  const parseStoredValue = (value: unknown): number | string | undefined => {
    const item = Array.isArray(value) ? value[0] : value;
    if (item === null || item === undefined) return undefined;
    const numeric = Number(item);
    return Number.isNaN(numeric) ? String(item) : numeric;
  };

  const getMatchingOptionValue = (
    options: LocationOption[],
    storedValue?: number | string
  ): number | string | undefined => {
    if (storedValue === undefined) return undefined;
    const option = options.find(
      (opt) => opt.value === storedValue || opt.label === storedValue
    );
    return option?.value;
  };

  // Parse stored location filters from localStorage once on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const savedFiltersRaw = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (savedFiltersRaw) {
        const parsed = JSON.parse(savedFiltersRaw);
        storedLocationRef.current = {
          state: parseStoredValue(parsed.states ?? parsed.state),
          district: parseStoredValue(parsed.districts ?? parsed.district),
          block: parseStoredValue(parsed.blocks ?? parsed.block),
          village: parseStoredValue(parsed.villages ?? parsed.village),
        };
        setIsStoredLocationLoaded(true);
        return;
      }

      const storedValue = localStorage.getItem('userdata');
      if (!storedValue) {
        setIsStoredLocationLoaded(true);
        return;
      }

      const parsedUserData = JSON.parse(storedValue);
      const customFields = parsedUserData?.customFields;
      if (!customFields) {
        setIsStoredLocationLoaded(true);
        return;
      }

      const getFieldByLabel = (label: string) =>
        customFields.find((field: any) => field.label === label);

      storedLocationRef.current = {
        state: parseCustomFieldSelection(getFieldByLabel('STATE')),
        district: parseCustomFieldSelection(getFieldByLabel('DISTRICT')),
        block: parseCustomFieldSelection(getFieldByLabel('BLOCK')),
        village: parseCustomFieldSelection(getFieldByLabel('VILLAGE')),
      };
    } catch (error) {
      console.error('Error reading stored location filters:', error);
    } finally {
      setIsStoredLocationLoaded(true);
    }
  }, []);

  function getLocationIds(fields: any[]) {
    const getByLabel = (label: string) =>
      fields?.find((f: any) => f.label === label)?.selectedValues?.[0];

    return {
      stateId: getByLabel('STATE')?.id ?? null,
      districtId: getByLabel('DISTRICT')?.id ?? null,
      blockId: getByLabel('BLOCK')?.id ?? null,
      villageId: getByLabel('VILLAGE')?.id ?? null,
    };
  }

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      const data = await getCohortData(localStorage.getItem('userId') || '');
      const userData = data?.result || {};
      console.log('userData=====>', userData[0]?.customField);
      const locationIds = getLocationIds(userData[0]?.customField);
      console.log('locationIds=====>', locationIds);

      setUserLocationIds(locationIds);

      try {
        const response = await getFieldOptions({
          fieldName: 'state',
          sort: ['state_name', 'asc'],
        });
        if (response?.result?.values) {
          const stateOptions = response.result.values.map((item: any) => ({
            value: item.value || item.state_id,
            label: item.label || item.state_name,
          }));
          setStates(stateOptions);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.states || states.length === 0) {
      return;
    }

    const storedMatch = getMatchingOptionValue(states, storedLocationRef.current.state);
    let newSelection: number | string = '';

    if (storedMatch !== undefined) {
      newSelection = storedMatch;
    } else if (userLocationIds.stateId) {
      const matchedState = states.find((state) => state.value === userLocationIds.stateId);
      newSelection = matchedState ? matchedState.value : '';
    }

    if (newSelection === '' && states[0]) {
      newSelection = states[0].value;
    }

    setSelectedState(newSelection);
    defaultsAppliedRef.current.states = true;
  }, [isStoredLocationLoaded, states, userLocationIds.stateId]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState !== '') {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        setDistricts([]);
        setBlocks([]);
        setVillages([]);
        setSelectedDistrict('');
        setSelectedBlock('');
        setSelectedVillage('');
        defaultsAppliedRef.current.districts = false;
        defaultsAppliedRef.current.blocks = false;
        defaultsAppliedRef.current.villages = false;
        try {
          const response = await getFieldOptions({
            fieldName: 'district',
            controllingfieldfk: [selectedState],
            sort: ['district_name', 'asc'],
          });
          if (response?.result?.values) {
            const districtOptions = response.result.values.map((item: any) => ({
              value: item.value || item.district_id,
              label: item.label || item.district_name,
            }));
            setDistricts(districtOptions);
          }
        } catch (error) {
          console.error('Error fetching districts:', error);
        } finally {
          setLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
      setBlocks([]);
      setVillages([]);
      setSelectedDistrict('');
      setSelectedBlock('');
      setSelectedVillage('');
    }
  }, [selectedState]);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.districts || districts.length === 0) {
      return;
    }

    const storedMatch = getMatchingOptionValue(districts, storedLocationRef.current.district);
    let newSelection: number | string = '';

    if (storedMatch !== undefined) {
      newSelection = storedMatch;
    } else if (userLocationIds.districtId) {
      const matchedDistrict = districts.find((d) => d.value === userLocationIds.districtId);
      newSelection = matchedDistrict ? matchedDistrict.value : '';
    }

    if (newSelection === '' && districts[0]) {
      newSelection = districts[0].value;
    }

    setSelectedDistrict(newSelection);
    defaultsAppliedRef.current.districts = true;
  }, [districts, isStoredLocationLoaded, userLocationIds.districtId]);

  // Fetch blocks when district is selected
  useEffect(() => {
    if (selectedDistrict !== '') {
      const fetchBlocks = async () => {
        setLoadingBlocks(true);
        setBlocks([]);
        setVillages([]);
        setSelectedBlock('');
        setSelectedVillage('');
        defaultsAppliedRef.current.blocks = false;
        defaultsAppliedRef.current.villages = false;
        try {
          const response = await getFieldOptions({
            fieldName: 'block',
            controllingfieldfk: [selectedDistrict],
            sort: ['block_name', 'asc'],
          });
          if (response?.result?.values) {
            const blockOptions = response.result.values.map((item: any) => ({
              value: item.value || item.block_id,
              label: item.label || item.block_name,
            }));
            setBlocks(blockOptions);
          }
        } catch (error) {
          console.error('Error fetching blocks:', error);
        } finally {
          setLoadingBlocks(false);
        }
      };

      fetchBlocks();
    } else {
      setBlocks([]);
      setVillages([]);
      setSelectedBlock('');
      setSelectedVillage('');
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.blocks || blocks.length === 0) {
      return;
    }

    const storedMatch = getMatchingOptionValue(blocks, storedLocationRef.current.block);
    let newSelection: number | string = '';

    if (storedMatch !== undefined) {
      newSelection = storedMatch;
    } else if (userLocationIds.blockId) {
      const matchedBlock = blocks.find((b) => b.value === userLocationIds.blockId);
      newSelection = matchedBlock ? matchedBlock.value : '';
    }

    if (newSelection === '' && blocks[0]) {
      newSelection = blocks[0].value;
    }

    setSelectedBlock(newSelection);
    defaultsAppliedRef.current.blocks = true;
  }, [blocks, isStoredLocationLoaded, userLocationIds.blockId]);

  // Fetch villages when block is selected
  useEffect(() => {
    if (selectedBlock !== '') {
      const fetchVillages = async () => {
        setLoadingVillages(true);
        setVillages([]);
        setSelectedVillage('');
        defaultsAppliedRef.current.villages = false;
        try {
          const response = await getFieldOptions({
            fieldName: 'village',
            controllingfieldfk: [selectedBlock],
            sort: ['village_name', 'asc'],
          });
          if (response?.result?.values) {
            const villageOptions = response.result.values.map((item: any) => ({
              value: item.value || item.village_id,
              label: item.label || item.village_name,
            }));
            setVillages(villageOptions);
          }
        } catch (error) {
          console.error('Error fetching villages:', error);
        } finally {
          setLoadingVillages(false);
        }
      };

      fetchVillages();
    } else {
      setVillages([]);
      setSelectedVillage('');
    }
  }, [selectedBlock]);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.villages || villages.length === 0) {
      return;
    }

    const storedMatch = getMatchingOptionValue(villages, storedLocationRef.current.village);
    let newSelection: number | string = '';

    if (storedMatch !== undefined) {
      newSelection = storedMatch;
    } else if (userLocationIds.villageId) {
      const matchedVillage = villages.find((v) => v.value === userLocationIds.villageId);
      newSelection = matchedVillage ? matchedVillage.value : '';
    }

    if (newSelection === '' && villages[0]) {
      newSelection = villages[0].value;
    }

    setSelectedVillage(newSelection);
    defaultsAppliedRef.current.villages = true;
  }, [villages, isStoredLocationLoaded, userLocationIds.villageId]);

  // Notify parent component when location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        states: selectedState !== '' ? [selectedState as number] : undefined,
        districts: selectedDistrict !== '' ? [selectedDistrict as number] : undefined,
        blocks: selectedBlock !== '' ? [selectedBlock as number] : undefined,
        villages: selectedVillage !== '' ? [selectedVillage as number] : undefined,
      });
    }
  }, [selectedState, selectedDistrict, selectedBlock, selectedVillage, onLocationChange]);

  // Persist current location selections so they survive modal close/page reloads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: StoredLocationFilters = {
      state: selectedState !== '' ? selectedState : undefined,
      district: selectedDistrict !== '' ? selectedDistrict : undefined,
      block: selectedBlock !== '' ? selectedBlock : undefined,
      village: selectedVillage !== '' ? selectedVillage : undefined,
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
  }, [selectedState, selectedDistrict, selectedBlock, selectedVillage]);

  return (
    <Box>
      <Grid container spacing={2}>
        {/* State Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="state-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              State
            </InputLabel>
            <Select
              labelId="state-select-label"
              label="State"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as number | string)}
              disabled={loadingStates}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
              {loadingStates ? (
                <MenuItem value="" disabled>
                  Loading states...
                </MenuItem>
              ) : states.length === 0 ? (
                <MenuItem value="" disabled>
                  No states available
                </MenuItem>
              ) : (
                states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* District Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="district-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              District
            </InputLabel>
            <Select
              labelId="district-select-label"
              label="District"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as number | string)}
              disabled={selectedState === '' || loadingDistricts}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
              {loadingDistricts ? (
                <MenuItem value="" disabled>
                  Loading districts...
                </MenuItem>
              ) : selectedState === '' ? (
                <MenuItem value="" disabled>
                  Select State first
                </MenuItem>
              ) : districts.length === 0 ? (
                <MenuItem value="" disabled>
                  No districts available
                </MenuItem>
              ) : (
                districts.map((district) => (
                  <MenuItem key={district.value} value={district.value}>
                    {district.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Block Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="block-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              Block
            </InputLabel>
            <Select
              labelId="block-select-label"
              label="Block"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value as number | string)}
              disabled={selectedDistrict === '' || loadingBlocks}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
              {loadingBlocks ? (
                <MenuItem value="" disabled>
                  Loading blocks...
                </MenuItem>
              ) : selectedDistrict === '' ? (
                <MenuItem value="" disabled>
                  Select District first
                </MenuItem>
              ) : blocks.length === 0 ? (
                <MenuItem value="" disabled>
                  No blocks available
                </MenuItem>
              ) : (
                blocks.map((block) => (
                  <MenuItem key={block.value} value={block.value}>
                    {block.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Village Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="village-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              Village
            </InputLabel>
            <Select
              labelId="village-select-label"
              label="Village"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value as number | string)}
              disabled={selectedBlock === '' || loadingVillages}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
              {loadingVillages ? (
                <MenuItem value="" disabled>
                  Loading villages...
                </MenuItem>
              ) : selectedBlock === '' ? (
                <MenuItem value="" disabled>
                  Select Block first
                </MenuItem>
              ) : villages.length === 0 ? (
                <MenuItem value="" disabled>
                  No villages available
                </MenuItem>
              ) : (
                villages.map((village) => (
                  <MenuItem key={village.value} value={village.value}>
                    {village.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationDropdowns;
