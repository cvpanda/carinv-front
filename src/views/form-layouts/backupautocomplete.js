            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={brandmodel.sort(sortBrand)}
                getOptionLabel={option => option.brand}
                onChange={(e, value) => {
                  setModelData(Object.keys(value.models))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.brand)}
                    helperText={Boolean(errors.brand) && errors.brand.message}
                    {...register('brand')}
                    label={t('Brand')}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={modelData.sort(sortModel)}
                onChange={(e, value) => {
                  setVersionData(brandmodel.find(item => item.brand === watch('brand'))?.models[value])
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.model)}
                    helperText={Boolean(errors.model) && errors.model.message}
                    {...register('model')}
                    label={t('Model')}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={versionData.sort(sortVersion)}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.version)}
                    helperText={Boolean(errors.version) && errors.version.message}
                    {...register('version')}
                    label={t('Version')}
                  />
                )}
              />
            </Grid>