/*
 * Copyright 2015 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.scribble.tools.web.rest;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Response;

import org.scribble.tools.web.api.model.Marker;
import org.scribble.tools.web.api.model.ProjectProtocolAction;
import org.scribble.tools.web.api.model.ProtocolProjection;
import org.scribble.tools.web.api.model.VerifyProtocolAction;
import org.scribble.tools.web.api.services.ActionManager;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST interface for performing actions on scribble protocols.
 *
 * @author gbrown
 *
 */
@Path("/actions")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@Api(value = "/", description = "Perform actions on scribble protocols")
public class ActionsHandler {
    
    @Inject
    private ActionManager actionManager;

    @POST
    @Path("/project")
    @ApiOperation(value = "Project a protocol definition",
            response = ProtocolProjection.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successfully projected a protocol"),
            @ApiResponse(code = 500, message = "Failed to project the protocol") })
    public void projectProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(value = "The projection action details", required = true) ProjectProtocolAction action) {

        try {
            ProtocolProjection result=actionManager.project(action);

            response.resume(Response.status(Response.Status.OK).entity(result).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @POST
    @Path("/verify")
    @ApiOperation(value = "Verify a protocol definition",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Verified a protocol"),
            @ApiResponse(code = 500, message = "Failed to verify the protocol") })
    public void verifyProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(value = "The verification action details", required = true) VerifyProtocolAction action) {

        try {
            List<Marker> result=actionManager.verify(action);

            response.resume(Response.status(Response.Status.OK).entity(result).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }
}
